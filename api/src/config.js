const PROTO_PATH = __dirname + '/protos/dependencies/validation.proto';
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
// Suggested options for similarity to existing grpc.load behavior
const packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    });
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
// The protoDescriptor object has the full package hierarchy
const Validation = protoDescriptor.payment.Validation;

const client = new Validation('localhost:45200', grpc.credentials.createInsecure());


function authorizeCreditCard(cardNumber, amount) {
    client.authorize({
        cardNumber: cardNumber,
        amount: amount
    }, (error, authorization) => {
        if (error) {
            console.warn(`::api:: error received`, error);
            return;
        }
        console.log(`::api:: authorization received ${authorization.approvalCode} - ${authorization.status}`)
    });
}

exports.authorizeCreditCard = authorizeCreditCard;
