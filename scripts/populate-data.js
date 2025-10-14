const { client, connectRedis } = require('../redis-client');
const hanjaData = require('./hanja-data');
const wordData = require('./word-data');

async function populateDatabase() {
  console.log('Starting database population...');
  
  try {
    // Connect to Redis
    await connectRedis();
    console.log('Connected to Redis successfully');
    
    // Clear existing data
    console.log('\nClearing existing data...');
    const keys = await client.keys('*');
    if (keys.length > 0) {
      await client.del(keys);
      console.log(`Cleared ${keys.length} keys`);
    }
    
    // Populate Hanja data
    console.log('\nPopulating Hanja data...');
    for (const hanja of hanjaData) {
      // Store hanja as hash
      await client.hSet(`hanja:${hanja.id}`, {
        character: hanja.character,
        meaning: hanja.meaning,
        reading_korean: hanja.reading_korean,
        reading_romanized: hanja.reading_romanized,
        category: hanja.category
      });
      
      // Add to sorted set by frequency (lower rank = more common)
      await client.zAdd('hanja:by_frequency', {
        score: hanja.frequency_rank,
        value: hanja.id
      });
      
      console.log(`  Added hanja: ${hanja.character} (${hanja.meaning})`);
    }
    console.log(`✓ Added ${hanjaData.length} hanja characters`);
    
    // Populate Word data
    console.log('\nPopulating Word data...');
    for (const word of wordData) {
      // Store word as hash
      await client.hSet(`word:${word.id}`, {
        hanja_word: word.hanja_word,
        hangul: word.hangul,
        romanized: word.romanized,
        meaning: word.meaning,
        category: word.category
      });
      
      // Add to sorted set by frequency
      await client.zAdd('words:by_frequency', {
        score: word.frequency_rank,
        value: word.id
      });
      
      console.log(`  Added word: ${word.hanja_word} (${word.meaning})`);
    }
    console.log(`✓ Added ${wordData.length} words`);
    
    // Create relationships between hanja and words
    console.log('\nCreating relationships...');
    let relationshipCount = 0;
    
    for (const word of wordData) {
      // For each word, link it to the hanja characters it contains
      for (const hanjaChar of word.hanja_characters) {
        // Find the hanja ID that matches this character
        const hanjaEntry = hanjaData.find(h => h.character === hanjaChar);
        
        if (hanjaEntry) {
          // Add word to hanja's word set
          await client.sAdd(`hanja:${hanjaEntry.id}:words`, word.id);
          
          // Add hanja to word's hanja set
          await client.sAdd(`word:${word.id}:hanja`, hanjaEntry.id);
          
          relationshipCount++;
        }
        // Note: Some words may contain hanja characters not in our database.
        // This is expected since we only include the 20 most common hanja.
      }
    }
    console.log(`✓ Created ${relationshipCount} hanja-word relationships`);
    
    // Print summary statistics
    console.log('\n=== Database Population Complete ===');
    console.log(`Total Hanja: ${await client.zCard('hanja:by_frequency')}`);
    console.log(`Total Words: ${await client.zCard('words:by_frequency')}`);
    console.log(`Total Relationships: ${relationshipCount}`);
    
    // Show some example relationships
    console.log('\n=== Example Relationships ===');
    const exampleHanja = hanjaData.slice(0, 3);
    for (const hanja of exampleHanja) {
      const wordIds = await client.sMembers(`hanja:${hanja.id}:words`);
      console.log(`\n${hanja.character} (${hanja.meaning}) appears in ${wordIds.length} words:`);
      for (const wordId of wordIds.slice(0, 3)) {
        const word = await client.hGetAll(`word:${wordId}`);
        console.log(`  - ${word.hanja_word} (${word.hangul}) - ${word.meaning}`);
      }
    }
    
    console.log('\n✓ Database population completed successfully!');
    
  } catch (error) {
    console.error('Error populating database:', error);
    process.exit(1);
  } finally {
    await client.quit();
    console.log('Redis connection closed');
  }
}

// Run the population
populateDatabase();
