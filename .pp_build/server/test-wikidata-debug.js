async function testWikidataQuery() {
    console.log('🔍 Debugging Wikidata SPARQL Queries\n');
    const endpoint = 'https://query.wikidata.org/sparql';
    // Test 1: Simple character query
    const simpleQuery = `
    SELECT DISTINCT ?entity ?entityLabel ?description WHERE {
      ?entity wdt:P31 wd:Q1114461.  # instance of: fictional character
      
      SERVICE wikibase:label { 
        bd:serviceParam wikibase:language "en". 
        ?entity rdfs:label ?entityLabel.
        ?entity schema:description ?description.
      }
    }
    LIMIT 5
  `;
    const params = new URLSearchParams({
        query: simpleQuery,
        format: 'json'
    });
    try {
        console.log('Testing simple character query (no universe filter)...\n');
        const response = await fetch(`${endpoint}?${params}`, {
            headers: {
                'User-Agent': 'PanelProfitsBot/1.0 (Entity Scraper)',
                'Accept': 'application/sparql-results+json'
            }
        });
        if (!response.ok) {
            console.error(`❌ Query failed: ${response.status}`);
            return;
        }
        const data = await response.json();
        const bindings = data.results?.bindings || [];
        console.log(`✅ Retrieved ${bindings.length} results\n`);
        bindings.forEach((b, i) => {
            console.log(`${i + 1}. ${b.entityLabel?.value || 'Unknown'}`);
            console.log(`   Entity: ${b.entity?.value}`);
            console.log(`   Description: ${b.description?.value || 'No description'}`);
            console.log('');
        });
        // Test 2: Character with universe
        console.log('\n======================================');
        console.log('Testing with Marvel Universe filter...');
        console.log('======================================\n');
        const marvelQuery = `
      SELECT DISTINCT ?entity ?entityLabel ?description ?universe ?universeLabel WHERE {
        ?entity wdt:P31 wd:Q1114461.  # instance of: fictional character
        ?entity wdt:P1080 ?universe.  # from fictional universe
        
        SERVICE wikibase:label { 
          bd:serviceParam wikibase:language "en". 
          ?entity rdfs:label ?entityLabel.
          ?entity schema:description ?description.
          ?universe rdfs:label ?universeLabel.
        }
      }
      LIMIT 10
    `;
        const params2 = new URLSearchParams({
            query: marvelQuery,
            format: 'json'
        });
        const response2 = await fetch(`${endpoint}?${params2}`, {
            headers: {
                'User-Agent': 'PanelProfitsBot/1.0 (Entity Scraper)',
                'Accept': 'application/sparql-results+json'
            }
        });
        const data2 = await response2.json();
        const bindings2 = data2.results?.bindings || [];
        console.log(`✅ Retrieved ${bindings2.length} results\n`);
        bindings2.forEach((b, i) => {
            console.log(`${i + 1}. ${b.entityLabel?.value || 'Unknown'}`);
            console.log(`   Universe: ${b.universeLabel?.value || 'Unknown'}`);
            console.log(`   Description: ${b.description?.value || 'No description'}`);
            console.log('');
        });
    }
    catch (error) {
        console.error('❌ Error:', error);
    }
}
testWikidataQuery();
