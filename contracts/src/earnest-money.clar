;; Earnest Money Smart Contract
;; Manages automated earnest money deposits and releases for real estate transactions

;; Constants
(define-constant CONTRACT_OWNER tx-sender)
(define-constant ERR_UNAUTHORIZED (err u200))
(define-constant ERR_ESCROW_NOT_FOUND (err u201))
(define-constant ERR_ESCROW_ALREADY_EXISTS (err u202))
(define-constant ERR_INSUFFICIENT_FUNDS (err u203))
(define-constant ERR_ALREADY_RELEASED (err u204))
(define-constant ERR_CONDITIONS_NOT_MET (err u205))
(define-constant ERR_INVALID_AMOUNT (err u206))

;; Data Variables
(define-data-var next-escrow-id uint u1)

;; Data Maps
(define-map escrow-accounts
  { escrow-id: uint }
  {
    transaction-id: (string-ascii 100),
    buyer: principal,
    seller: principal,
    agent: (optional principal),
    amount: uint,
    is-released: bool,
    release-conditions-met: bool,
    created-block: uint,
    released-block: (optional uint)
  }
)

(define-map escrow-by-transaction
  { transaction-id: (string-ascii 100) }
  { escrow-id: uint }
)

;; Private Functions
(define-private (is-authorized-party (escrow-id uint))
  (match (map-get? escrow-accounts { escrow-id: escrow-id })
    escrow (or 
             (is-eq tx-sender (get buyer escrow))
             (is-eq tx-sender (get seller escrow))
             (match (get agent escrow)
               agent (is-eq tx-sender agent)
               false
             )
           )
    false
  )
)

;; Public Functions

;; Deposit earnest money into escrow
(define-public (deposit-earnest-money 
  (transaction-id (string-ascii 100))
  (seller principal)
  (agent (optional principal))
  (amount uint))
  
  (let ((escrow-id (var-get next-escrow-id)))
    (asserts! (> amount u0) ERR_INVALID_AMOUNT)
    (asserts! (is-none (map-get? escrow-by-transaction { transaction-id: transaction-id })) ERR_ESCROW_ALREADY_EXISTS)
    
    ;; Transfer STX from buyer to contract
    (try! (stx-transfer? amount tx-sender (as-contract tx-sender)))
    
    (map-set escrow-accounts
      { escrow-id: escrow-id }
      {
        transaction-id: transaction-id,
        buyer: tx-sender,
        seller: seller,
        agent: agent,
        amount: amount,
        is-released: false,
        release-conditions-met: false,
        created-block: block-height,
        released-block: none
      }
    )
    
    (map-set escrow-by-transaction
      { transaction-id: transaction-id }
      { escrow-id: escrow-id }
    )
    
    (var-set next-escrow-id (+ escrow-id u1))
    
    (ok escrow-id)
  )
)

;; Mark inspection conditions as met (called by authorized agent)
(define-public (mark-conditions-met (escrow-id uint))
  (let ((escrow (unwrap! (map-get? escrow-accounts { escrow-id: escrow-id }) ERR_ESCROW_NOT_FOUND)))
    (asserts! (is-authorized-party escrow-id) ERR_UNAUTHORIZED)
    (asserts! (not (get is-released escrow)) ERR_ALREADY_RELEASED)
    
    (map-set escrow-accounts
      { escrow-id: escrow-id }
      (merge escrow { release-conditions-met: true })
    )
    
    (ok true)
  )
)

;; Release earnest money to seller (automated when conditions are met)
(define-public (release-earnest-money (escrow-id uint))
  (let ((escrow (unwrap! (map-get? escrow-accounts { escrow-id: escrow-id }) ERR_ESCROW_NOT_FOUND)))
    (asserts! (is-authorized-party escrow-id) ERR_UNAUTHORIZED)
    (asserts! (not (get is-released escrow)) ERR_ALREADY_RELEASED)
    (asserts! (get release-conditions-met escrow) ERR_CONDITIONS_NOT_MET)
    
    ;; Transfer STX from contract to seller
    (try! (as-contract (stx-transfer? (get amount escrow) tx-sender (get seller escrow))))
    
    (map-set escrow-accounts
      { escrow-id: escrow-id }
      (merge escrow {
        is-released: true,
        released-block: (some block-height)
      })
    )
    
    (ok true)
  )
)

;; Refund earnest money to buyer (in case of failed conditions)
(define-public (refund-earnest-money (escrow-id uint))
  (let ((escrow (unwrap! (map-get? escrow-accounts { escrow-id: escrow-id }) ERR_ESCROW_NOT_FOUND)))
    (asserts! (is-authorized-party escrow-id) ERR_UNAUTHORIZED)
    (asserts! (not (get is-released escrow)) ERR_ALREADY_RELEASED)
    (asserts! (not (get release-conditions-met escrow)) ERR_CONDITIONS_NOT_MET)
    
    ;; Transfer STX from contract back to buyer
    (try! (as-contract (stx-transfer? (get amount escrow) tx-sender (get buyer escrow))))
    
    (map-set escrow-accounts
      { escrow-id: escrow-id }
      (merge escrow {
        is-released: true,
        released-block: (some block-height)
      })
    )
    
    (ok true)
  )
)

;; Read-only Functions

;; Get escrow details
(define-read-only (get-escrow (escrow-id uint))
  (map-get? escrow-accounts { escrow-id: escrow-id })
)

;; Get escrow by transaction ID
(define-read-only (get-escrow-by-transaction (transaction-id (string-ascii 100)))
  (match (map-get? escrow-by-transaction { transaction-id: transaction-id })
    escrow-ref (map-get? escrow-accounts { escrow-id: (get escrow-id escrow-ref) })
    none
  )
)

;; Get escrow balance
(define-read-only (get-escrow-balance (escrow-id uint))
  (match (map-get? escrow-accounts { escrow-id: escrow-id })
    escrow (if (get is-released escrow) u0 (get amount escrow))
    u0
  )
)

;; Get next escrow ID
(define-read-only (get-next-escrow-id)
  (var-get next-escrow-id)
)
