import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
    name: "Property Registry: Can register a new property",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const wallet1 = accounts.get('wallet_1')!;
        
        let block = chain.mineBlock([
            Tx.contractCall('property-registry', 'register-property', [
                types.principal(wallet1.address),
                types.ascii("123 Main St, Anytown, ST 12345"),
                types.ascii("Lot 1, Block 2, Subdivision ABC")
            ], deployer.address)
        ]);
        
        assertEquals(block.receipts.length, 1);
        assertEquals(block.receipts[0].result.expectOk(), types.uint(1));
        
        // Verify property was registered
        let getProperty = chain.callReadOnlyFn('property-registry', 'get-property', [
            types.uint(1)
        ], deployer.address);
        
        const property = getProperty.result.expectSome().expectTuple();
        assertEquals(property['owner'], wallet1.address);
        assertEquals(property['address'], "123 Main St, Anytown, ST 12345");
        assertEquals(property['is-active'], true);
    },
});

Clarinet.test({
    name: "Property Registry: Cannot register duplicate property address",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const wallet1 = accounts.get('wallet_1')!;
        
        // Register first property
        let block1 = chain.mineBlock([
            Tx.contractCall('property-registry', 'register-property', [
                types.principal(wallet1.address),
                types.ascii("123 Main St, Anytown, ST 12345"),
                types.ascii("Lot 1, Block 2, Subdivision ABC")
            ], deployer.address)
        ]);
        
        assertEquals(block1.receipts[0].result.expectOk(), types.uint(1));
        
        // Try to register same address again
        let block2 = chain.mineBlock([
            Tx.contractCall('property-registry', 'register-property', [
                types.principal(wallet1.address),
                types.ascii("123 Main St, Anytown, ST 12345"),
                types.ascii("Different legal description")
            ], deployer.address)
        ]);
        
        assertEquals(block2.receipts[0].result.expectErr(), types.uint(102)); // ERR_PROPERTY_ALREADY_EXISTS
    },
});

Clarinet.test({
    name: "Property Registry: Can transfer ownership",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const wallet1 = accounts.get('wallet_1')!;
        const wallet2 = accounts.get('wallet_2')!;
        
        // Register property
        let block1 = chain.mineBlock([
            Tx.contractCall('property-registry', 'register-property', [
                types.principal(wallet1.address),
                types.ascii("123 Main St, Anytown, ST 12345"),
                types.ascii("Lot 1, Block 2, Subdivision ABC")
            ], deployer.address)
        ]);
        
        assertEquals(block1.receipts[0].result.expectOk(), types.uint(1));
        
        // Transfer ownership
        let block2 = chain.mineBlock([
            Tx.contractCall('property-registry', 'transfer-ownership', [
                types.uint(1),
                types.principal(wallet2.address)
            ], wallet1.address)
        ]);
        
        assertEquals(block2.receipts[0].result.expectOk(), types.bool(true));
        
        // Verify new owner
        let getProperty = chain.callReadOnlyFn('property-registry', 'get-property', [
            types.uint(1)
        ], deployer.address);
        
        const property = getProperty.result.expectSome().expectTuple();
        assertEquals(property['owner'], wallet2.address);
    },
});

Clarinet.test({
    name: "Property Registry: Only owner can transfer property",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const wallet1 = accounts.get('wallet_1')!;
        const wallet2 = accounts.get('wallet_2')!;
        const wallet3 = accounts.get('wallet_3')!;
        
        // Register property
        let block1 = chain.mineBlock([
            Tx.contractCall('property-registry', 'register-property', [
                types.principal(wallet1.address),
                types.ascii("123 Main St, Anytown, ST 12345"),
                types.ascii("Lot 1, Block 2, Subdivision ABC")
            ], deployer.address)
        ]);
        
        assertEquals(block1.receipts[0].result.expectOk(), types.uint(1));
        
        // Try to transfer from non-owner
        let block2 = chain.mineBlock([
            Tx.contractCall('property-registry', 'transfer-ownership', [
                types.uint(1),
                types.principal(wallet3.address)
            ], wallet2.address) // wallet2 is not the owner
        ]);
        
        assertEquals(block2.receipts[0].result.expectErr(), types.uint(100)); // ERR_UNAUTHORIZED
    },
});

Clarinet.test({
    name: "Property Registry: Can add mortgage encumbrance",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const wallet1 = accounts.get('wallet_1')!;
        const wallet2 = accounts.get('wallet_2')!; // Lender
        
        // Register property
        let block1 = chain.mineBlock([
            Tx.contractCall('property-registry', 'register-property', [
                types.principal(wallet1.address),
                types.ascii("123 Main St, Anytown, ST 12345"),
                types.ascii("Lot 1, Block 2, Subdivision ABC")
            ], deployer.address)
        ]);
        
        assertEquals(block1.receipts[0].result.expectOk(), types.uint(1));
        
        // Add mortgage encumbrance
        let block2 = chain.mineBlock([
            Tx.contractCall('property-registry', 'add-encumbrance', [
                types.uint(1),
                types.ascii("MORTGAGE"),
                types.ascii("First mortgage lien for $300,000"),
                types.some(types.uint(300000000000)), // 300,000 STX in microSTX
                types.some(types.principal(wallet2.address))
            ], wallet1.address)
        ]);
        
        assertEquals(block2.receipts[0].result.expectOk(), types.uint(1));
        
        // Verify encumbrance was added
        let getEncumbrance = chain.callReadOnlyFn('property-registry', 'get-encumbrance', [
            types.uint(1)
        ], deployer.address);
        
        const encumbrance = getEncumbrance.result.expectSome().expectTuple();
        assertEquals(encumbrance['property-id'], types.uint(1));
        assertEquals(encumbrance['encumbrance-type'], "MORTGAGE");
        assertEquals(encumbrance['is-active'], true);
    },
});

Clarinet.test({
    name: "Property Registry: Can remove encumbrance",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const wallet1 = accounts.get('wallet_1')!;
        const wallet2 = accounts.get('wallet_2')!;
        
        // Register property and add encumbrance
        let block1 = chain.mineBlock([
            Tx.contractCall('property-registry', 'register-property', [
                types.principal(wallet1.address),
                types.ascii("123 Main St, Anytown, ST 12345"),
                types.ascii("Lot 1, Block 2, Subdivision ABC")
            ], deployer.address),
            Tx.contractCall('property-registry', 'add-encumbrance', [
                types.uint(1),
                types.ascii("LIEN"),
                types.ascii("Tax lien for unpaid property taxes"),
                types.some(types.uint(5000000000)), // 5,000 STX
                types.some(types.principal(wallet2.address))
            ], wallet1.address)
        ]);
        
        assertEquals(block1.receipts[0].result.expectOk(), types.uint(1));
        assertEquals(block1.receipts[1].result.expectOk(), types.uint(1));
        
        // Remove encumbrance
        let block2 = chain.mineBlock([
            Tx.contractCall('property-registry', 'remove-encumbrance', [
                types.uint(1)
            ], wallet1.address)
        ]);
        
        assertEquals(block2.receipts[0].result.expectOk(), types.bool(true));
        
        // Verify encumbrance is inactive
        let getEncumbrance = chain.callReadOnlyFn('property-registry', 'get-encumbrance', [
            types.uint(1)
        ], deployer.address);
        
        const encumbrance = getEncumbrance.result.expectSome().expectTuple();
        assertEquals(encumbrance['is-active'], false);
    },
});

Clarinet.test({
    name: "Property Registry: Invalid encumbrance type rejected",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const wallet1 = accounts.get('wallet_1')!;
        
        // Register property
        let block1 = chain.mineBlock([
            Tx.contractCall('property-registry', 'register-property', [
                types.principal(wallet1.address),
                types.ascii("123 Main St, Anytown, ST 12345"),
                types.ascii("Lot 1, Block 2, Subdivision ABC")
            ], deployer.address)
        ]);
        
        assertEquals(block1.receipts[0].result.expectOk(), types.uint(1));
        
        // Try to add invalid encumbrance type
        let block2 = chain.mineBlock([
            Tx.contractCall('property-registry', 'add-encumbrance', [
                types.uint(1),
                types.ascii("INVALID_TYPE"),
                types.ascii("Some description"),
                types.none(),
                types.none()
            ], wallet1.address)
        ]);
        
        assertEquals(block2.receipts[0].result.expectErr(), types.uint(108)); // ERR_INVALID_ENCUMBRANCE_TYPE
    },
});

Clarinet.test({
    name: "Property Registry: Can update property status",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const wallet1 = accounts.get('wallet_1')!;
        
        // Register property
        let block1 = chain.mineBlock([
            Tx.contractCall('property-registry', 'register-property', [
                types.principal(wallet1.address),
                types.ascii("123 Main St, Anytown, ST 12345"),
                types.ascii("Lot 1, Block 2, Subdivision ABC")
            ], deployer.address)
        ]);
        
        assertEquals(block1.receipts[0].result.expectOk(), types.uint(1));
        
        // Deactivate property
        let block2 = chain.mineBlock([
            Tx.contractCall('property-registry', 'update-property-status', [
                types.uint(1),
                types.bool(false)
            ], wallet1.address)
        ]);
        
        assertEquals(block2.receipts[0].result.expectOk(), types.bool(true));
        
        // Verify property is inactive
        let getProperty = chain.callReadOnlyFn('property-registry', 'get-property', [
            types.uint(1)
        ], deployer.address);
        
        const property = getProperty.result.expectSome().expectTuple();
        assertEquals(property['is-active'], false);
    },
});
