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


function recordSuccessfulAuthorization() {
    let call = client.recordSuccessfulAuth({});
    call.on("data", (successfulAuth) => {
        console.log(`::hotfile:: successfull auth received ${successfulAuth.approvalCode}`)
    });
    call.on('error', (err) => {
        console.warn(`::hotfile:: error received`, err);
    });
    call.on('end', () => {
        console.log(`::hotfile:: connection with payment service finished`);
    });
}

exports.recordSuccessfulAuthorization = recordSuccessfulAuthorization;
