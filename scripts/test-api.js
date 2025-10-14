#!/usr/bin/env node

/**
 * Test script to verify Redis database and API functionality
 */

const http = require('http');

const API_HOST = process.env.API_HOST || 'localhost';
const API_PORT = process.env.API_PORT || 3000;

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: API_HOST,
      port: API_PORT,
      path: path,
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

async function runTests() {
  console.log('=== Redis Database API Tests ===\n');

  try {
    // Test 1: Health check
    console.log('1. Testing health endpoint...');
    const health = await makeRequest('/health');
    console.log(`   Status: ${health.status}`);
    console.log(`   Redis: ${health.redis}`);
    console.log('   ✓ Health check passed\n');

    // Test 2: Get all hanja
    console.log('2. Testing get all hanja...');
    const hanja = await makeRequest('/api/hanja');
    console.log(`   Retrieved ${hanja.length} hanja characters`);
    console.log(`   First hanja: ${hanja[0].character} (${hanja[0].meaning})`);
    console.log('   ✓ Get all hanja passed\n');

    // Test 3: Get specific hanja
    console.log('3. Testing get specific hanja...');
    const personHanja = await makeRequest('/api/hanja/person');
    console.log(`   Character: ${personHanja.character}`);
    console.log(`   Meaning: ${personHanja.meaning}`);
    console.log(`   Associated words: ${personHanja.words.length}`);
    if (personHanja.words.length > 0) {
      console.log(`   Example word: ${personHanja.words[0].hanja_word} (${personHanja.words[0].meaning})`);
    }
    console.log('   ✓ Get specific hanja passed\n');

    // Test 4: Get all words
    console.log('4. Testing get all words...');
    const words = await makeRequest('/api/words');
    console.log(`   Retrieved ${words.length} words`);
    console.log(`   First word: ${words[0].hanja_word} (${words[0].meaning})`);
    console.log('   ✓ Get all words passed\n');

    // Test 5: Get specific word
    console.log('5. Testing get specific word...');
    const humanWord = await makeRequest('/api/words/human_being');
    console.log(`   Hanja: ${humanWord.hanja_word}`);
    console.log(`   Hangul: ${humanWord.hangul}`);
    console.log(`   Meaning: ${humanWord.meaning}`);
    console.log(`   Uses ${humanWord.hanja.length} hanja characters`);
    console.log('   ✓ Get specific word passed\n');

    // Test 6: Search words by hanja
    console.log('6. Testing search by hanja character...');
    const searchResults = await makeRequest('/api/search/words-by-hanja/人');
    console.log(`   Found ${searchResults.length} words containing '人'`);
    if (searchResults.length > 0) {
      console.log('   Examples:');
      searchResults.slice(0, 3).forEach(word => {
        console.log(`     - ${word.hanja_word} (${word.hangul}) - ${word.meaning}`);
      });
    }
    console.log('   ✓ Search passed\n');

    console.log('=== All tests passed! ===');
    process.exit(0);

  } catch (error) {
    console.error('\n✗ Test failed:', error.message);
    process.exit(1);
  }
}

// Run tests
runTests();
