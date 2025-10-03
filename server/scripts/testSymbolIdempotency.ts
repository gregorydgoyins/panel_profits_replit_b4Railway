import { PineconeAssetExpansionService } from '../services/pineconeAssetExpansion';

async function testIdempotency() {
  console.log('🧪 Testing Symbol Generation Idempotency\n');
  
  const service = new PineconeAssetExpansionService();
  
  // Mock Pinecone records (simulate same records being processed twice)
  const mockRecords = {
    characters: [
      {
        id: 'char-001',
        values: [],
        metadata: {
          filename: 'Spider-Man.md',
          filepath: '/characters/Spider-Man.md',
          publisher: 'Marvel',
          processed_date: '2024-01-01'
        }
      },
      {
        id: 'char-002',
        values: [],
        metadata: {
          filename: 'Captain America (House of M).md',
          filepath: '/characters/Captain America (House of M).md',
          publisher: 'Marvel',
          processed_date: '2024-01-01'
        }
      }
    ],
    creators: [
      {
        id: 'creator-001',
        values: [],
        metadata: {
          filename: 'Stan_Lee.md',
          filepath: '/creators/Stan_Lee.md',
          publisher: 'Marvel',
          processed_date: '2024-01-01'
        }
      },
      {
        id: 'creator-002',
        values: [],
        metadata: {
          filename: 'Rob_Leigh.md',
          filepath: '/creators/Rob_Leigh.md',
          publisher: 'Marvel',
          processed_date: '2024-01-01'
        }
      }
    ],
    comics: []
  };

  // Transform the same records twice
  console.log('📦 First transformation...');
  const result1 = await service.transformRecordsToAssets(mockRecords);
  const assets1 = [...result1.characterAssets, ...result1.creatorAssets];
  
  console.log('\n📦 Second transformation (same records)...');
  const result2 = await service.transformRecordsToAssets(mockRecords);
  const assets2 = [...result2.characterAssets, ...result2.creatorAssets];
  
  // Compare symbols
  console.log('\n📊 Comparing symbols for idempotency...\n');
  
  let allMatch = true;
  for (let i = 0; i < assets1.length; i++) {
    const symbol1 = assets1[i].symbol;
    const symbol2 = assets2[i].symbol;
    const name = assets1[i].name;
    
    if (symbol1 === symbol2) {
      console.log(`✅ ${name.padEnd(40)} ${symbol1} (identical)`);
    } else {
      console.log(`❌ ${name.padEnd(40)} ${symbol1} vs ${symbol2} (DIFFERENT!)`);
      allMatch = false;
    }
  }
  
  console.log('\n' + '='.repeat(70));
  if (allMatch) {
    console.log('✅ SUCCESS: All symbols are deterministic and idempotent!');
    console.log('   Same Pinecone records → Same symbols every time');
  } else {
    console.log('❌ FAILURE: Symbol generation is not deterministic');
    console.log('   Same records produced different symbols');
  }
  console.log('='.repeat(70) + '\n');
  
  process.exit(allMatch ? 0 : 1);
}

testIdempotency().catch(console.error);
