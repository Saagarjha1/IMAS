const { Client } = require('@elastic/elasticsearch');

// 🧠 Load environment variables
require('dotenv').config(); // In case not already loaded

const elasticNode = process.env.ELASTIC_NODE;

if (!elasticNode) {
  console.error('❌ ELASTIC_NODE is not set in .env');
  process.exit(1);
}

const elasticClient = new Client({
  node: elasticNode,
});

elasticClient.ping()
  .then(() => console.log('✅ Elasticsearch connected'))
  .catch((err) => {
    console.error('❌ Elasticsearch connection failed:', err);
    process.exit(1);
  });

module.exports = elasticClient;
