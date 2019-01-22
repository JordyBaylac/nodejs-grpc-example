const PROTO_PATH = __dirname + '/protos/validation.proto';
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
const validationService = protoDescriptor.payment.Validation.service;

const validationHandlers = require('./validation');
const EventEmitter = require('events');
const authEmitter = new EventEmitter();



/**
 * Get a new server with the handler functions in this file bound to the methods
 * it serves.
 * @return {Server} The new server object
 */
function getServer() {
    var server = new grpc.Server();
    server.addService(validationService, {
        authorize: (call, callback) => {
            const authResponse = validationHandlers.authorize(call.request);
            if (authResponse.status === "OK") {                
                authEmitter.emit('successful-authorization', authResponse.approvalCode);
            }
            callback(null, authResponse);            
        },
        recordSuccessfulAuth: (call, callback) => {
            authEmitter.on('successful-authorization', (approvalCode) => {
                call.write({
                    approvalCode: approvalCode
                });
            });
            authEmitter.on('end', () => {
                call.end();
            })
        },
    });
    return server;
}

function startServer(port) {
    var routeServer = getServer();
    routeServer.bind(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure());
    routeServer.start();
}

exports.startServer = startServer;
