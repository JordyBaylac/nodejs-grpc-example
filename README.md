# NodeJS gRPC example

This repo is a basic microservice architecture for a fake payment service application. The solution is composed by 3 services (1 gRPC server and 2 clients).

## Use case

An **api** needs to check a given user has enough funds in its bank account. For that, the api will send an authorization request to a **payment** service. In that call, the api sends the credit card number and the amount to hold.

The service will reply with a status (*"ACCEPTED"* or *"DECLINED"*) and an approval code, that works as the client's bank confirmation code. The whole system needs also to get track of successful authorizations, so that at the end of the day, a **hotfile** (a report) is submitted to an external company that will then move the funds and complete the settlement.

## Proposed solution

We will develop 3 microservices:

* One for the payment service bussiness.
* One for the api bussines.
* One for the hotfile process.


## Services description

### **payment**

This service expose a gRPC server with two methods:

* **authorize**: will simulate a credit card authorization.  
* **recordSuccessfulAuth**: will stream successfull authorization.

Check the [protobuf service definition](https://github.com/JordyBaylac/nodejs-grpc-example/blob/master/payment/src/protos/validation.proto).

### **hotfile**

This client get subscribed to the *recordSuccessfulAuth* method and will print a message if a successful authorization is received.

### **api**

This client will send credit card authorization requests to the payment service every 4 seconds. A message will be printed with the authorization response received.


## Result

![Payment solution](https://github.com/JordyBaylac/nodejs-grpc-example/blob/master/sample.png)