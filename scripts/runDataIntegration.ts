#!/usr/bin/env tsx

// Script to run the complete data integration for Panel Profits Phase 2
import { dataIntegration } from '../server/dataIntegration';

async function main() {
  console.log('🚀 Starting Panel Profits Phase 2 Data Integration');
  console.log('================================================');
  console.log('Importing 200,000+ data points from your comprehensive comic datasets...\n');

  try {
    const results = await dataIntegration.runCompleteIntegration();
    
    console.log('\n🎉 Data Integration Summary:');
    console.log('============================');
    console.log(`🏛️ Mythological Houses: ${results.houses}`);
    console.log(`⚔️ Battle Scenarios: ${results.battles}`);
    console.log(`📚 Comic Issues: ${results.comics}`);
    console.log(`🦸 Characters: ${results.characters}`);
    console.log(`🎬 Movies: ${results.movies}`);
    
    const totalRecords = results.battles + results.comics + results.characters + results.movies;
    console.log(`📊 Total Records Imported: ${totalRecords}`);
    console.log('\n✨ Panel Profits is now powered by the most comprehensive comic trading dataset ever assembled!');
    console.log('🎮 Your mythological trading RPG is ready for Phase 2 implementation!');
    
  } catch (error: any) {
    console.error('❌ Data integration failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main().catch(console.error);