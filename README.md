# service-template

Template for microservices.

## HTTP API

`/api/v1/examples/:id`

- [GET](/src/http-controller/get.md)



## Bus Messaging

- DTO's are serialized using JSON.

### Publish-Subscribe

- Publishes demo messages

| Routing Key | Description                   | Outgoing Type                |
|-------------|-------------------------------|------------------------------|

- Subscribed to

| Routing Key | Service               | Reason                |
|-------------|-----------------------|-----------------------|
