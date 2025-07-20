# Smart Contracts

This directory contains the Clarity smart contracts for the Transparent Transaction Ledger platform.

## Contracts

### 1. Property Registry (`property-registry.clar`)
Manages immutable property records and ownership transfers on the Stacks blockchain.

**Key Functions:**
- `register-property`: Register a new property with owner and legal description
- `transfer-ownership`: Transfer property ownership to a new owner
- `get-property`: Retrieve property details by ID
- `get-property-by-address`: Find property by address

### 2. Earnest Money (`earnest-money.clar`)
Manages automated earnest money deposits and releases for real estate transactions.

**Key Functions:**
- `deposit-earnest-money`: Deposit STX into escrow for a transaction
- `mark-conditions-met`: Mark inspection conditions as satisfied
- `release-earnest-money`: Release funds to seller when conditions are met
- `refund-earnest-money`: Refund to buyer if conditions fail

### 3. Title Transfer (`title-transfer.clar`)
*TODO: Implement automated title transfer functionality for post-MVP*

## Development

### Prerequisites
- [Clarinet](https://github.com/hirosystems/clarinet) CLI tool
- Stacks blockchain knowledge

### Commands

```bash
# Check contract syntax
clarinet check

# Run tests
clarinet test

# Deploy to testnet
clarinet deploy --testnet

# Interactive console
clarinet console
```

### Testing

Test files are located in the `tests/` directory. Each contract has corresponding test files written in TypeScript.

### Deployment

Contracts are deployed using Clarinet. Configuration is managed in `Clarinet.toml`.

**Networks:**
- **Testnet**: For development and testing
- **Mainnet**: For production deployment

### Security Considerations

- All contracts include proper authorization checks
- Funds are held securely in escrow
- Events are logged for transparency
- Error handling prevents invalid state transitions

## Integration

These contracts are integrated with the backend API through the Stacks.js library. The backend handles:

- Contract deployment
- Function calls
- Transaction monitoring
- Event processing

## Future Enhancements

- Multi-signature support for high-value transactions
- Integration with external oracles for property valuations
- Automated compliance checking
- Cross-chain compatibility
