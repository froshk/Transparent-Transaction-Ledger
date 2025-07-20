;; Property Registry Smart Contract
;; Manages immutable property records and ownership transfers on the Stacks blockchain

;; Constants
(define-constant CONTRACT_OWNER tx-sender)
(define-constant ERR_UNAUTHORIZED (err u100))
(define-constant ERR_PROPERTY_NOT_FOUND (err u101))
(define-constant ERR_PROPERTY_ALREADY_EXISTS (err u102))
(define-constant ERR_INVALID_OWNER (err u103))
(define-constant ERR_ENCUMBRANCE_NOT_FOUND (err u104))
(define-constant ERR_ENCUMBRANCE_ALREADY_EXISTS (err u105))
(define-constant ERR_INVALID_AMOUNT (err u106))
(define-constant ERR_PROPERTY_NOT_ACTIVE (err u107))
(define-constant ERR_INVALID_ENCUMBRANCE_TYPE (err u108))

;; Data Variables
(define-data-var next-property-id uint u1)
(define-data-var next-encumbrance-id uint u1)

;; Data Maps
(define-map properties
  { property-id: uint }
  {
    owner: principal,
    address: (string-ascii 200),
    legal-description: (string-ascii 500),
    registration-block: uint,
    last-update-block: uint,
    is-active: bool
  }
)

(define-map property-history
  { property-id: uint, event-id: uint }
  {
    event-type: (string-ascii 50),
    description: (string-ascii 200),
    block-height: uint,
    tx-sender: principal
  }
)

(define-map property-by-address
  { address: (string-ascii 200) }
  { property-id: uint }
)

;; Property Encumbrances (liens, easements, mortgages, etc.)
(define-map property-encumbrances
  { encumbrance-id: uint }
  {
    property-id: uint,
    encumbrance-type: (string-ascii 50),
    description: (string-ascii 500),
    amount: (optional uint),
    creditor: (optional principal),
    recorded-date: uint,
    is-active: bool,
    recorded-by: principal
  }
)

;; Map to track encumbrances by property
(define-map property-encumbrance-list
  { property-id: uint, encumbrance-id: uint }
  { exists: bool }
)

;; Private Functions
(define-private (is-contract-owner)
  (is-eq tx-sender CONTRACT_OWNER)
)

(define-private (is-property-owner (property-id uint))
  (match (map-get? properties { property-id: property-id })
    property (is-eq (get owner property) tx-sender)
    false
  )
)

(define-private (is-valid-encumbrance-type (encumbrance-type (string-ascii 50)))
  (or
    (is-eq encumbrance-type "MORTGAGE")
    (is-eq encumbrance-type "LIEN")
    (is-eq encumbrance-type "EASEMENT")
    (is-eq encumbrance-type "COVENANT")
    (is-eq encumbrance-type "RESTRICTION")
  )
)

(define-private (add-property-event (property-id uint) (event-type (string-ascii 50)) (description (string-ascii 200)))
  (let ((event-id (+ (default-to u0 (get event-id (map-get? property-history { property-id: property-id, event-id: u0 }))) u1)))
    (map-set property-history
      { property-id: property-id, event-id: event-id }
      {
        event-type: event-type,
        description: description,
        block-height: block-height,
        tx-sender: tx-sender
      }
    )
  )
)

;; Public Functions

;; Register a new property
(define-public (register-property (owner principal) (address (string-ascii 200)) (legal-description (string-ascii 500)))
  (let ((property-id (var-get next-property-id)))
    (asserts! (is-none (map-get? property-by-address { address: address })) ERR_PROPERTY_ALREADY_EXISTS)
    
    (map-set properties
      { property-id: property-id }
      {
        owner: owner,
        address: address,
        legal-description: legal-description,
        registration-block: block-height,
        last-update-block: block-height,
        is-active: true
      }
    )
    
    (map-set property-by-address
      { address: address }
      { property-id: property-id }
    )
    
    (add-property-event property-id "REGISTERED" "Property registered on blockchain")
    (var-set next-property-id (+ property-id u1))
    
    (ok property-id)
  )
)

;; Transfer property ownership
(define-public (transfer-ownership (property-id uint) (new-owner principal))
  (let ((property (unwrap! (map-get? properties { property-id: property-id }) ERR_PROPERTY_NOT_FOUND)))
    (asserts! (is-eq (get owner property) tx-sender) ERR_UNAUTHORIZED)
    (asserts! (get is-active property) ERR_PROPERTY_NOT_ACTIVE)

    (map-set properties
      { property-id: property-id }
      (merge property {
        owner: new-owner,
        last-update-block: block-height
      })
    )

    (add-property-event property-id "OWNERSHIP_TRANSFERRED" "Property ownership transferred")

    (ok true)
  )
)

;; Add encumbrance to property (liens, mortgages, easements, etc.)
(define-public (add-encumbrance
  (property-id uint)
  (encumbrance-type (string-ascii 50))
  (description (string-ascii 500))
  (amount (optional uint))
  (creditor (optional principal)))

  (let ((encumbrance-id (var-get next-encumbrance-id))
        (property (unwrap! (map-get? properties { property-id: property-id }) ERR_PROPERTY_NOT_FOUND)))

    ;; Validate inputs
    (asserts! (get is-active property) ERR_PROPERTY_NOT_ACTIVE)
    (asserts! (is-valid-encumbrance-type encumbrance-type) ERR_INVALID_ENCUMBRANCE_TYPE)
    (asserts! (or (is-property-owner property-id) (is-contract-owner)) ERR_UNAUTHORIZED)

    ;; Validate amount if provided
    (match amount
      some-amount (asserts! (> some-amount u0) ERR_INVALID_AMOUNT)
      true
    )

    ;; Record the encumbrance
    (map-set property-encumbrances
      { encumbrance-id: encumbrance-id }
      {
        property-id: property-id,
        encumbrance-type: encumbrance-type,
        description: description,
        amount: amount,
        creditor: creditor,
        recorded-date: block-height,
        is-active: true,
        recorded-by: tx-sender
      }
    )

    ;; Link encumbrance to property
    (map-set property-encumbrance-list
      { property-id: property-id, encumbrance-id: encumbrance-id }
      { exists: true }
    )

    ;; Add to property history
    (add-property-event property-id "ENCUMBRANCE_ADDED" description)

    ;; Increment encumbrance ID
    (var-set next-encumbrance-id (+ encumbrance-id u1))

    (ok encumbrance-id)
  )
)

;; Remove/discharge an encumbrance
(define-public (remove-encumbrance (encumbrance-id uint))
  (let ((encumbrance (unwrap! (map-get? property-encumbrances { encumbrance-id: encumbrance-id }) ERR_ENCUMBRANCE_NOT_FOUND)))

    ;; Validate authorization
    (asserts! (get is-active encumbrance) ERR_ENCUMBRANCE_NOT_FOUND)
    (asserts! (or
                (is-property-owner (get property-id encumbrance))
                (is-contract-owner)
                (match (get creditor encumbrance)
                  some-creditor (is-eq tx-sender some-creditor)
                  false
                )
              ) ERR_UNAUTHORIZED)

    ;; Mark encumbrance as inactive
    (map-set property-encumbrances
      { encumbrance-id: encumbrance-id }
      (merge encumbrance { is-active: false })
    )

    ;; Add to property history
    (add-property-event (get property-id encumbrance) "ENCUMBRANCE_REMOVED" "Encumbrance discharged")

    (ok true)
  )
)

;; Update property status (activate/deactivate)
(define-public (update-property-status (property-id uint) (active bool))
  (let ((property (unwrap! (map-get? properties { property-id: property-id }) ERR_PROPERTY_NOT_FOUND)))
    (asserts! (or (is-property-owner property-id) (is-contract-owner)) ERR_UNAUTHORIZED)

    (map-set properties
      { property-id: property-id }
      (merge property {
        is-active: active,
        last-update-block: block-height
      })
    )

    (add-property-event property-id
      (if active "PROPERTY_ACTIVATED" "PROPERTY_DEACTIVATED")
      (if active "Property reactivated" "Property deactivated"))

    (ok true)
  )
)

;; Read-only Functions

;; Get property details
(define-read-only (get-property (property-id uint))
  (map-get? properties { property-id: property-id })
)

;; Get property by address
(define-read-only (get-property-by-address (address (string-ascii 200)))
  (match (map-get? property-by-address { address: address })
    property-ref (map-get? properties { property-id: (get property-id property-ref) })
    none
  )
)

;; Get property owner
(define-read-only (get-property-owner (property-id uint))
  (match (map-get? properties { property-id: property-id })
    property (some (get owner property))
    none
  )
)

;; Get property history event
(define-read-only (get-property-event (property-id uint) (event-id uint))
  (map-get? property-history { property-id: property-id, event-id: event-id })
)

;; Get next property ID
(define-read-only (get-next-property-id)
  (var-get next-property-id)
)

;; Get encumbrance details
(define-read-only (get-encumbrance (encumbrance-id uint))
  (map-get? property-encumbrances { encumbrance-id: encumbrance-id })
)

;; Check if property has active encumbrances
(define-read-only (has-active-encumbrances (property-id uint))
  (let ((property (unwrap! (map-get? properties { property-id: property-id }) false)))
    ;; This is a simplified check - in a full implementation,
    ;; we would iterate through all encumbrances for the property
    ;; For now, we return false as a placeholder
    false
  )
)

;; Get property encumbrance count (simplified implementation)
(define-read-only (get-encumbrance-count (property-id uint))
  ;; In a full implementation, this would count active encumbrances
  ;; For now, return 0 as placeholder
  u0
)

;; Validate property for transaction (checks if property is clear for transfer)
(define-read-only (is-property-clear-for-transfer (property-id uint))
  (match (map-get? properties { property-id: property-id })
    property (and
               (get is-active property)
               (not (has-active-encumbrances property-id))
             )
    false
  )
)

;; Get next encumbrance ID
(define-read-only (get-next-encumbrance-id)
  (var-get next-encumbrance-id)
)
