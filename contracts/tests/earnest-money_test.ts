import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
    name: "Earnest Money: Can deposit earnest money",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const buyer = accounts.get('wallet_1')!;
        const seller = accounts.get('wallet_2')!;
        const agent = accounts.get('wallet_3')!;
        
        let block = chain.mineBlock([
            Tx.contractCall('earnest-money', 'deposit-earnest-money', [
                types.ascii("TXN-001"),
                types.principal(seller.address),
                types.some(types.principal(agent.address)),
                types.uint(10000000000) // 10,000 STX in microSTX
            ], buyer.address)
        ]);
        
        assertEquals(block.receipts.length, 1);
        assertEquals(block.receipts[0].result.expectOk(), types.uint(1));
        
        // Verify escrow was created
        let getEscrow = chain.callReadOnlyFn('earnest-money', 'get-escrow', [
            types.uint(1)
        ], deployer.address);
        
        const escrow = getEscrow.result.expectSome().expectTuple();
        assertEquals(escrow['transaction-id'], "TXN-001");
        assertEquals(escrow['buyer'], buyer.address);
        assertEquals(escrow['seller'], seller.address);
        assertEquals(escrow['amount'], types.uint(10000000000));
        assertEquals(escrow['is-released'], false);
        assertEquals(escrow['release-conditions-met'], false);
    },
});

Clarinet.test({
    name: "Earnest Money: Cannot deposit with zero amount",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const buyer = accounts.get('wallet_1')!;
        const seller = accounts.get('wallet_2')!;
        
        let block = chain.mineBlock([
            Tx.contractCall('earnest-money', 'deposit-earnest-money', [
                types.ascii("TXN-001"),
                types.principal(seller.address),
                types.none(),
                types.uint(0) // Invalid amount
            ], buyer.address)
        ]);
        
        assertEquals(block.receipts[0].result.expectErr(), types.uint(206)); // ERR_INVALID_AMOUNT
    },
});

Clarinet.test({
    name: "Earnest Money: Cannot create duplicate escrow for same transaction",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const buyer = accounts.get('wallet_1')!;
        const seller = accounts.get('wallet_2')!;
        
        // First deposit
        let block1 = chain.mineBlock([
            Tx.contractCall('earnest-money', 'deposit-earnest-money', [
                types.ascii("TXN-001"),
                types.principal(seller.address),
                types.none(),
                types.uint(5000000000) // 5,000 STX
            ], buyer.address)
        ]);
        
        assertEquals(block1.receipts[0].result.expectOk(), types.uint(1));
        
        // Try to create another escrow for same transaction
        let block2 = chain.mineBlock([
            Tx.contractCall('earnest-money', 'deposit-earnest-money', [
                types.ascii("TXN-001"), // Same transaction ID
                types.principal(seller.address),
                types.none(),
                types.uint(3000000000)
            ], buyer.address)
        ]);
        
        assertEquals(block2.receipts[0].result.expectErr(), types.uint(202)); // ERR_ESCROW_ALREADY_EXISTS
    },
});

Clarinet.test({
    name: "Earnest Money: Agent can mark conditions as met",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const buyer = accounts.get('wallet_1')!;
        const seller = accounts.get('wallet_2')!;
        const agent = accounts.get('wallet_3')!;
        
        // Deposit earnest money
        let block1 = chain.mineBlock([
            Tx.contractCall('earnest-money', 'deposit-earnest-money', [
                types.ascii("TXN-001"),
                types.principal(seller.address),
                types.some(types.principal(agent.address)),
                types.uint(10000000000)
            ], buyer.address)
        ]);
        
        assertEquals(block1.receipts[0].result.expectOk(), types.uint(1));
        
        // Agent marks conditions as met
        let block2 = chain.mineBlock([
            Tx.contractCall('earnest-money', 'mark-conditions-met', [
                types.uint(1)
            ], agent.address)
        ]);
        
        assertEquals(block2.receipts[0].result.expectOk(), types.bool(true));
        
        // Verify conditions are marked as met
        let getEscrow = chain.callReadOnlyFn('earnest-money', 'get-escrow', [
            types.uint(1)
        ], buyer.address);
        
        const escrow = getEscrow.result.expectSome().expectTuple();
        assertEquals(escrow['release-conditions-met'], true);
    },
});

Clarinet.test({
    name: "Earnest Money: Can release money when conditions are met",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const buyer = accounts.get('wallet_1')!;
        const seller = accounts.get('wallet_2')!;
        const agent = accounts.get('wallet_3')!;
        
        // Deposit earnest money and mark conditions as met
        let block1 = chain.mineBlock([
            Tx.contractCall('earnest-money', 'deposit-earnest-money', [
                types.ascii("TXN-001"),
                types.principal(seller.address),
                types.some(types.principal(agent.address)),
                types.uint(10000000000)
            ], buyer.address),
            Tx.contractCall('earnest-money', 'mark-conditions-met', [
                types.uint(1)
            ], agent.address)
        ]);
        
        assertEquals(block1.receipts[0].result.expectOk(), types.uint(1));
        assertEquals(block1.receipts[1].result.expectOk(), types.bool(true));
        
        // Release earnest money
        let block2 = chain.mineBlock([
            Tx.contractCall('earnest-money', 'release-earnest-money', [
                types.uint(1)
            ], agent.address)
        ]);
        
        assertEquals(block2.receipts[0].result.expectOk(), types.bool(true));
        
        // Verify escrow is released
        let getEscrow = chain.callReadOnlyFn('earnest-money', 'get-escrow', [
            types.uint(1)
        ], buyer.address);
        
        const escrow = getEscrow.result.expectSome().expectTuple();
        assertEquals(escrow['is-released'], true);
    },
});

Clarinet.test({
    name: "Earnest Money: Cannot release without conditions met",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const buyer = accounts.get('wallet_1')!;
        const seller = accounts.get('wallet_2')!;
        const agent = accounts.get('wallet_3')!;
        
        // Deposit earnest money (but don't mark conditions as met)
        let block1 = chain.mineBlock([
            Tx.contractCall('earnest-money', 'deposit-earnest-money', [
                types.ascii("TXN-001"),
                types.principal(seller.address),
                types.some(types.principal(agent.address)),
                types.uint(10000000000)
            ], buyer.address)
        ]);
        
        assertEquals(block1.receipts[0].result.expectOk(), types.uint(1));
        
        // Try to release without conditions met
        let block2 = chain.mineBlock([
            Tx.contractCall('earnest-money', 'release-earnest-money', [
                types.uint(1)
            ], agent.address)
        ]);
        
        assertEquals(block2.receipts[0].result.expectErr(), types.uint(205)); // ERR_CONDITIONS_NOT_MET
    },
});

Clarinet.test({
    name: "Earnest Money: Can refund when conditions not met",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const buyer = accounts.get('wallet_1')!;
        const seller = accounts.get('wallet_2')!;
        const agent = accounts.get('wallet_3')!;
        
        // Deposit earnest money
        let block1 = chain.mineBlock([
            Tx.contractCall('earnest-money', 'deposit-earnest-money', [
                types.ascii("TXN-001"),
                types.principal(seller.address),
                types.some(types.principal(agent.address)),
                types.uint(10000000000)
            ], buyer.address)
        ]);
        
        assertEquals(block1.receipts[0].result.expectOk(), types.uint(1));
        
        // Refund earnest money (conditions not met)
        let block2 = chain.mineBlock([
            Tx.contractCall('earnest-money', 'refund-earnest-money', [
                types.uint(1)
            ], buyer.address)
        ]);
        
        assertEquals(block2.receipts[0].result.expectOk(), types.bool(true));
        
        // Verify escrow is released (refunded)
        let getEscrow = chain.callReadOnlyFn('earnest-money', 'get-escrow', [
            types.uint(1)
        ], buyer.address);
        
        const escrow = getEscrow.result.expectSome().expectTuple();
        assertEquals(escrow['is-released'], true);
    },
});

Clarinet.test({
    name: "Earnest Money: Unauthorized party cannot mark conditions",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const buyer = accounts.get('wallet_1')!;
        const seller = accounts.get('wallet_2')!;
        const unauthorized = accounts.get('wallet_4')!;
        
        // Deposit earnest money
        let block1 = chain.mineBlock([
            Tx.contractCall('earnest-money', 'deposit-earnest-money', [
                types.ascii("TXN-001"),
                types.principal(seller.address),
                types.none(), // No agent
                types.uint(10000000000)
            ], buyer.address)
        ]);
        
        assertEquals(block1.receipts[0].result.expectOk(), types.uint(1));
        
        // Unauthorized party tries to mark conditions
        let block2 = chain.mineBlock([
            Tx.contractCall('earnest-money', 'mark-conditions-met', [
                types.uint(1)
            ], unauthorized.address)
        ]);
        
        assertEquals(block2.receipts[0].result.expectErr(), types.uint(200)); // ERR_UNAUTHORIZED
    },
});

Clarinet.test({
    name: "Earnest Money: Get escrow balance works correctly",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const buyer = accounts.get('wallet_1')!;
        const seller = accounts.get('wallet_2')!;
        const deployer = accounts.get('deployer')!;
        
        // Deposit earnest money
        let block1 = chain.mineBlock([
            Tx.contractCall('earnest-money', 'deposit-earnest-money', [
                types.ascii("TXN-001"),
                types.principal(seller.address),
                types.none(),
                types.uint(15000000000) // 15,000 STX
            ], buyer.address)
        ]);
        
        assertEquals(block1.receipts[0].result.expectOk(), types.uint(1));
        
        // Check balance before release
        let getBalance1 = chain.callReadOnlyFn('earnest-money', 'get-escrow-balance', [
            types.uint(1)
        ], deployer.address);
        
        assertEquals(getBalance1.result, types.uint(15000000000));
        
        // Refund the money
        let block2 = chain.mineBlock([
            Tx.contractCall('earnest-money', 'refund-earnest-money', [
                types.uint(1)
            ], buyer.address)
        ]);
        
        assertEquals(block2.receipts[0].result.expectOk(), types.bool(true));
        
        // Check balance after release (should be 0)
        let getBalance2 = chain.callReadOnlyFn('earnest-money', 'get-escrow-balance', [
            types.uint(1)
        ], deployer.address);
        
        assertEquals(getBalance2.result, types.uint(0));
    },
});
