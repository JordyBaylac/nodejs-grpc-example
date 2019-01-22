const PROTO_PATH = __dirname + '/../protos/dependencies/validation.proto';
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

const tracer = require('./tracing').tracer;
const { Tags, FORMAT_HTTP_HEADERS } = require('opentracing');

async function authorizeCreditCard(ctx, cardNumber, amount) {

    const span = tracer.startSpan("sending-authorization", { childOf: ctx.span });

    let headers = {};
    tracer.inject(span, FORMAT_HTTP_HEADERS, headers);

    var metadata = new grpc.Metadata();
    Object.keys(headers).forEach((k) => {
        metadata.add(k, headers[k]);
    });    

    return new Promise((resolve, reject) => {
        client.authorize({
            cardNumber: cardNumber,
            amount: amount
        }, 
        metadata, 
        (error, authorization) => {

            if (error) {
                span.log({
                    event: "authorization-error",
                    value: error.toString(),
                });
                span.setTag(Tags.ERROR, true)
                span.finish();
                reject(error);
                return;
            }

            span.log({
                event: "authorization-ok",
                value: JSON.stringify(authorization),
            });
            span.finish();
            resolve(authorization);
        });
    });
}

exports.authorizeCreditCard = authorizeCreditCard;
