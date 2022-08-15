require('dotenv').config();

const config = {
  apiKey: process.env.HONEYCOMB_API_KEY,
  endpoint: process.env.HONEYCOMB_ENDPONT,
  service: process.env.HONEYCOMB_SERVICE,
  dataset: process.env.HONEYCOMB_DATASET
};

module.exports = config;