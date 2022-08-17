require('dotenv').config();

const config = require('./config')
const proc = require('process');
const { Resource } = require('@opentelemetry/resources');
const { NodeSDK } = require('@opentelemetry/sdk-node');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-grpc'); // grpc
const { credentials } = require("@grpc/grpc-js");

const traceExporter = new OTLPTraceExporter({
  url: config.endpoint,
  credentials: credentials.createSsl(),
});

const sdk = new NodeSDK({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: config.service,
  }),
  traceExporter,
  instrumentations: [getNodeAutoInstrumentations()]
});

sdk.start()
  .then(() => console.log('Tracing initialized'))
  .catch((error) => console.log('Error initializing tracing', error));

proc.on('SIGTERM', () => {
  sdk.shutdown()
    .then(() => console.log('Tracing terminated'))
    .catch((error) => console.log('Error terminating tracing', error))
    .finally(() => proc.exit(0));
});