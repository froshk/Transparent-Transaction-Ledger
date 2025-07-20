;; Property Registry Smart Contract
;; Manages immutable property records and ownership transfers on the Stacks blockchain

;; Constants
(define-constant CONTRACT_OWNER tx-sender)
(define-constant ERR_UNAUTHORIZED (err u100))
(define-constant ERR_PROPERTY_NOT_FOUND (err u101))
(define-constant ERR_PROPERTY_ALREADY_EXISTS (err u102))
(define-constant ERR_INVALID_OWNER (err u103))

;; Data Variables
(define-data-var next-property-id uint u1)

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

;; Private Functions
(define-private (is-contract-owner)
  (is-eq tx-sender CONTRACT_OWNER)
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
    (asserts! (get is-active property) ERR_PROPERTY_NOT_FOUND)
    
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
