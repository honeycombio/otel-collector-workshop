slidenumbers: true

![original](../presentation_template/title_slide.jpg)

[.header: #FFFFFF, Roboto]

# **Honeycomb**
## OpenTelemetry Collector Workshop

---

![original](../presentation_template/purple_slide_1.jpg)
![right](../presentation_template/david.jpg)

## **Meet Your Presenter**


### **David Marchante**
### Implementation Engineer

---

![original](../presentation_template/purple_slide_1.jpg)

## **OpenTelemetry Collector Workshop**


In this training, you will learn about:

 - What is OpenTelemetry?
 - What is and why to use the OpenTelemetry Collector?
 - How to set-up and send data to Honeycomb via the Collector

---

![original](../presentation_template/purple_slide_2.jpg)

[.header: #FFFFFF, Roboto]

# **Let's :bee:gin In!** 

---

![original](../presentation_template/blue_slide_1.jpg)

# **Using OpenTelemetry (OTel)**

---

![original](../presentation_template/white_slide_1.jpg)

## **What is OTel?**

OpenTelemetry is a method for instrumenting systems in ways that will produce distributed traces.

- Available for a wide variety of languages.
- Preferred method as it is now a CNCF standard.
- Provides the flexibility to follow the same principles no matter the tracing tool being used.

---

![original](../presentation_template/white_slide_1.jpg)

## **What is the OpenTelemetry Collector?**

Verbose text bookish word soupy answer:

Vendor-agnostic implementation of how to receive, process and export telemetry data removing the need to run, operate, and maintain multiple agents/collectors with improved scalability supporting open-source observability data formats while sending to one or more open-source or commercial back-ends serving as the default location where instrumentation libraries export their telemetry data.

[^1]: Collector. OpenTelemetry. (n.d.). Retrieved August 16, 2022, from https://opentelemetry.io/docs/collector/ 

---

![original](../presentation_template/white_slide_1.jpg)

## **Why Use the OpenTelemetry Collector?**

- Usability

^Reasonable default configuration, support for popular protocols, runs and collects out of the box

- Performance

^Stable and performant that can handle varying loads and configurations

- Observability

^Facilites more observable systems 

- Extensibility

^Allows for customization without having to tocuh your core code base

- Unification

^A single codebase that is deployable as an agent or collector with support for traces, and metrics (logs are on the roadmap for future support)

---

![original](../presentation_template/white_slide_1.jpg)

## **When to Use OpenTelemetry Collector?**

- Easier to say when not to use

^When trying out or to get a quick start (auto-instrumentation) to get a view of your data

^Small-scale environments can still yield decent results without a Collector

^Otherwise, it is generally recommended to use a the Collector with your service

- Generally recommended

    - Offloads data quickly

    - Takes care of additional handling

^Retries

^Batching

^Encryption

^Sensitive data filtereing

---

![original](../presentation_template/orange_slide_1.jpg)

# **Sending Data to Honeycomb:**
## OpenTelemetry

---

![original](../presentation_template/white_slide_1.jpg)

# **Integrate OpenTelemetry**

To send data to Honeycomb, we must:

- Install the OTel Packages
- Initialize
- Add Any Additional Context If Applicable 

---

![original](../presentation_template/white_slide_1.jpg)

# **Integrate OpenTelemetry Collector**

To send data via a Collector to Honeycomb, we can use:

- Docker/Docker Compose

^We will be reviewing docekr compose in this workshop

- Kubernetes

^Deploys as agent and single gateway instance, there is also a ![Helm Chart](https://github.com/open-telemetry/opentelemetry-helm-charts/tree/main/charts/opentelemetry-collector)

- OS Packaging

^There is support for Linux, MacOS,and Windows

- Local Deployment


---

![original](../presentation_template/blue_slide_1.jpg)

# **Technical Techniques**

^Opentelemetry JS: https://open-telemetry.github.io/opentelemetry-js/

^Ruby: https://opentelemetry.io/docs/ruby/ (Still Beta. Would Recommend Beelines)

^Python: https://opentelemetry-python.readthedocs.io/en/stable/ ()

^PHP: (https://github.com/open-telemetry/opentelemetry-php) ^BETA Mode

---

![original](../presentation_template/blue_slide_1.jpg)

# **Example** :watch:
## Using JavaScript as a use case

---

![original](../presentation_template/white_slide_1.jpg)

# **Install OpenTelemetry Modules**

```console
npm install --save \
    @opentelemetry/sdk-node \
    @opentelemetry/resources \
    @opentelemetry/exporter-trace-otlp-grpc \
    @opentelemetry/auto-instrumentations-node \
    @grpc/grpc-js
```

---

![original](../presentation_template/white_slide_1.jpg)

# **Initializing OpenTelemetry**

[.column]
To initialize OpenTelemetry you will set-up a `tracing.js` file in th root of you application:

[.column]
``` js
// tracing.js
const config = require('./config')
const process = require('process');
const { Resource } = require('@opentelemetry/resources');
const { NodeSDK } = require('@opentelemetry/sdk-node');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-grpc');
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

process.on('SIGTERM', () => {
  sdk.shutdown()
    .then(() => console.log('Tracing terminated'))
    .catch((error) => console.log('Error terminating tracing', error))
    .finally(() => process.exit(0));
});
```
^This is using a config file that makes use of environment variables

^ Breifly explain what is going on here and how it is autoinsturmented

---

![original](../presentation_template/white_slide_1.jpg)

# **Import `tracing.js` File**

To get instrumentation wired up import the `tracing.js` in your main server file:


```js
'use strict';

require('./tracing')

const config = require('./config')
const express = require('express');

// App
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(config.port, config.port);
console.log(`Running on http://${config.host}:${config.port}`);
```

---

![original](../presentation_template/white_slide_1.jpg)

# **Configure OpenTelemetry Collector**

A simple configuration for a Collector in the root of the application, typically named `otel-collector-config.yaml`

```yaml
receivers:
  otlp:
    protocols:
      grpc: 
        # endpoint: 0.0.0.0:4317
      http:
        # endpoint: 0.0.0.0:4318

processors:
  batch:

exporters:
  otlp:
    endpoint: "api.honeycomb.io:443"
    headers:
      "x-honeycomb-team": $HONEYCOMB_API_KEY

service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [batch]
      exporters: [otlp]
```

^This is a simple collector that is configured to export to Honeycomb

^We can build on this and export things like Prometheus metrics from the collector configuration as well

---

![original](../presentation_template/white_slide_1.jpg)

# **Configure Dockerfile**

We will use `docker-compose` so we will add a `Dockerfile`

```Dockerfile
FROM node:16
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8081
CMD [ "npm", "start" ]

```

---

![original](../presentation_template/white_slide_1.jpg)

# **Configure `docker-compose`**

Finally we configure the `docker-compose.yml` where we can run both the application and the Collector

```yaml
version: "3" 
services: 
  application: 
    build:
      dockerfile: Dockerfile
      context: ./app
    ports:
      - 127.0.0.1:8081:8081
    environment:
      OTEL_ENDPOINT:
      OTEL_SERVICE:
      HONEYCOMB_API_KEY:

  otel-collector:
    container_name: otel-collector-workshop-container
    image: otel/opentelemetry-collector-contrib:latest
    command: ["--config=/etc/otel-collector-config.yaml"]
    volumes: 
      - ./otel-collector-config.yaml:/etc/otel-collector-config.yaml
    ports:
      - "4317" # OTLP gRPC receiver
    environment:
      HONEYCOMB_API_KEY:
```
^This exposes both the application and Collector endpoints allowing application tracing data to flow into Honeycomb via the Collector

^From here we can just add to the collector to extend what is getting sent into Honeycomb

^Ensure that tha file name for the otel-collector config in volumes matches what you named your collector confifg 

---

![original](../presentation_template/white_slide_1.jpg)

# **File Structure**

```
|_app
|   |_.env
|   |_.gitignore
|   |_config.js
|   |_Dockerfile
|   |_package-lock.json
|   |_package.json
|   |_server.js
|   |_tracing.js
|_docker-compose.yaml
|_otel-collector-config.yaml
```

---

![original](../presentation_template/green_slide_1.jpg)
# **Team Breakouts**

---

![original](../presentation_template/yellow_slide_1.jpg)

# **Instrumentation Resources**

---

![original](../presentation_template/white_slide_1.jpg)

# **Resources To Get Started**

There are several ways to get started:

- Honeycomb Instrumentation Docs

^https://docs.honeycomb.io/getting-data-in/opentelemetry/#quickstart-instructions

- Honeycomb Examples in Github
  
^https://github.com/honeycombio/examples

- OpenTelemetry Documentation

^https://opentelemetry.io/docs/

- OpenTelemetry Registry

^https://opentelemetry.io/registry/

- OpenTelemetry Github

^https://github.com/open-telemetry

---

![original](../presentation_template/purple_slide_1.jpg)

# **Thanks for Joining!** :smile:<br>

---

![original](../presentation_template/end_slide.jpg)
