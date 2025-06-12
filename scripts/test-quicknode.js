const { Connection } = require('@solana/web3.js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

async function testQuickNodeConnection() {
  console.log('🔧 Testing QuickNode Solana Mainnet Connection...\n');
  
  // Get QuickNode endpoint from environment
  const quickNodeEndpoint = process.env.NEXT_PUBLIC_SOLANA_RPC_URL_MAINNET;
  const devnetEndpoint = process.env.NEXT_PUBLIC_SOLANA_RPC_URL_DEVNET;
  
  console.log('📡 Endpoints:');
  console.log(`  QuickNode Mainnet: ${quickNodeEndpoint}`);
  console.log(`  Devnet: ${devnetEndpoint}`);
  console.log('');
  
  // Test QuickNode Mainnet Connection
  try {
    console.log('🚀 Testing QuickNode Mainnet...');
    const mainnetConnection = new Connection(quickNodeEndpoint, 'confirmed');
    
    const startTime = Date.now();
    const slot = await mainnetConnection.getSlot();
    const responseTime = Date.now() - startTime;
    
    console.log(`✅ QuickNode Mainnet Connection Success!`);
    console.log(`   Current Slot: ${slot}`);
    console.log(`   Response Time: ${responseTime}ms`);
    console.log('');
    
    // Test additional endpoints
    const version = await mainnetConnection.getVersion();
    console.log(`   Solana Version: ${version['solana-core']}`);
    
    const health = await mainnetConnection.getHealth();
    console.log(`   Health Status: ${health}`);
    console.log('');
    
  } catch (error) {
    console.log('❌ QuickNode Mainnet Connection Failed:');
    console.log(`   Error: ${error.message}`);
    console.log('');
  }
  
  // Test Devnet Connection for comparison
  try {
    console.log('🧪 Testing Devnet Connection...');
    const devnetConnection = new Connection(devnetEndpoint, 'confirmed');
    
    const startTime = Date.now();
    const slot = await devnetConnection.getSlot();
    const responseTime = Date.now() - startTime;
    
    console.log(`✅ Devnet Connection Success!`);
    console.log(`   Current Slot: ${slot}`);
    console.log(`   Response Time: ${responseTime}ms`);
    console.log('');
    
  } catch (error) {
    console.log('❌ Devnet Connection Failed:');
    console.log(`   Error: ${error.message}`);
    console.log('');
  }
  
  // Test WebSocket connection (if available)
  if (process.env.NEXT_PUBLIC_SOLANA_WSS_URL_MAINNET) {
    console.log('🌐 Testing WebSocket Connection...');
    try {
      const wsConnection = new Connection(
        quickNodeEndpoint,
        {
          commitment: 'confirmed',
          wsEndpoint: process.env.NEXT_PUBLIC_SOLANA_WSS_URL_MAINNET
        }
      );
      
      const slot = await wsConnection.getSlot();
      console.log(`✅ WebSocket Connection Success!`);
      console.log(`   Current Slot: ${slot}`);
      console.log('');
      
    } catch (error) {
      console.log('❌ WebSocket Connection Failed:');
      console.log(`   Error: ${error.message}`);
      console.log('');
    }
  }
  
  console.log('🎉 Connection test complete!');
  console.log('');
  console.log('💡 To use mainnet in your app:');
  console.log('   1. Set NEXT_PUBLIC_SOLANA_NETWORK=mainnet in .env.local');
  console.log('   2. Restart your development server');
  console.log('   3. Your DET minting will now use QuickNode mainnet!');
}

// Run the test
testQuickNodeConnection().catch(console.error);
