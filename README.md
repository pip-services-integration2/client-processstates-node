# <img src="https://github.com/pip-services/pip-services/raw/master/design/Logo.png" alt="Pip.Services Logo" style="max-width:30%"> <br/> Process States microservice

This is Process States microservice from Pip.Services library. 
It stores Process States between internally and external service

The microservice currently supports the following deployment options:
* Deployment platforms: Standalone Process, Seneca
* External APIs: HTTP/REST
* Persistence: Flat Files, MongoDB

This microservice has no dependencies on other microservices.

<a name="links"></a> Quick Links:

* [Download Links](doc/Downloads.md)
* [Development Guide](doc/Development.md)
* [Configuration Guide](doc/Configuration.md)
* [Deployment Guide](doc/Deployment.md)
* Process States Service
  - [Node.js SDK](https://github.com/pip-services-integration2/service-processstates-node)
* Communication Protocols
  - [HTTP Version 1](doc/HttpProtocolV1.md)
 
## Contract

Logical contract of the microservice is presented below. For physical implementation (HTTP/REST, Thrift, Seneca, Lambda, etc.),
please, refer to documentation of the specific protocol.

```typescript

```

## Download

Right now the only way to get the microservice is to check it out directly from github repository
```bash
git clone git@github.com:pip-services-integration/client-processstates-node.git
```

Pip.Service team is working to implement packaging and make stable releases available for your 
as zip downloadable archieves.

## Run

Add **config.yml** file to the root of the microservice folder and set configuration parameters.
As the starting point you can use example configuration from **config.example.yml** file. 

Example of microservice configuration
```yaml
- descriptor: "pip-services-container:container-info:default:default:1.0"
  name: "service-processstates"
  description: "Process States microservice"

- descriptor: "pip-services-commons:logger:console:default:1.0"
  level: "trace"

- descriptor: "service-processstates:persistence:file:default:1.0"
  path: "./data/processstates.json"

- descriptor: "service-processstates:controller:default:default:1.0"

- descriptor: "service-processstates:service:http:default:1.0"
  connection:
    protocol: "http"
    host: "0.0.0.0"
    port: 8080
```
 
For more information on the microservice configuration see [Configuration Guide](Configuration.md).

Start the microservice using the command:
```bash
node run
```

## Install

The easiest way to work with the microservice is to use client SDK. 
The complete list of available client SDKs for different languages is listed in the [Quick Links](#links)

If you use Node.js then you should add dependency to the client SDK into **package.json** file of your project
```javascript
{
    ...
    "dependencies": {
        ....
        "client-processstates-node": "^1.0.*",
        ...
    }
}
```


## Use

Inside your code get the reference to the client SDK
```typescript
 import { Process StatesHttpClientV1 } from 'client-processstates-node';
```

Define client configuration parameters.

```typescript
// Client configuration
let httpConfig = ConfigParams.fromTuples(
    "connection.protocol", "http",
    "connection.host", "localhost",
    "connection.port", 3000
);
client.configure(httpConfig);
```

Instantiate the client and open connection to the microservice
```typescript
// Create the client instance
client = new Process StatesHttpClientV1();

// Connect to the microservice
await client.open(null);

// Work with the microservice
...
```


## Acknowledgements

This microservice was created and currently maintained by 
- *Sergey Seroukhov*.
- *Levichev Dmitry*
- *Danil Prisiazhnyi*
