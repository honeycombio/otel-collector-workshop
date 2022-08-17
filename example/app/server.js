'use strict';

require('./tracing')

const config = require('./config')
const express = require('express');

// App
const app = express();

// Create custom metrics
// const httpRequestDurationMicroseconds = new Prometheus.Histogram({
//   name: 'http_request_duration_ms',
//   help: 'Duration of HTTP requests in ms',
//   labelNames: ['route'],
//   // buckets for response time from 0.1ms to 500ms
//   buckets: [0.10, 5, 15, 50, 100, 200, 300, 400, 500]
// })

// Setup app to Prometheus scrapes:
app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', Prometheus.register.contentType);
    res.end(await Prometheus.register.metrics());
  } catch (ex) {
    res.status(500).end(ex);
  }
})

app.get('/', (req, res) => {
  const start = Date.now()
  
  res.send('Hello World');
  
  // const duration = Date.now() - start

  // httpRequestDurationMicroseconds
  // .labels(req.route.path)
  // .observe(duration)
});

app.listen(config.port, config.port);
console.log(`Running on http://${config.host}:${config.port}`);