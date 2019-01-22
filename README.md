# NodeJS gRPC example

The solution is composed by 3 services. 1 server and 2 clients:

* payment
* api
* hotfile

## **payment** service

This service expose a gRPC server with two methods:

* *authorize*: will simulate a credit card authorization.  
* *recordSuccessfulAuth*: will stream only successfull authorization.

## **hotfile** service

This client get subscribed to the *recordSuccessfulAuth* method and will print a message if a successful authorization is received.

## **api** service

This client will send credit card authorization requests to the payment service every 4 seconds. A message will be printed with the authorization response received.