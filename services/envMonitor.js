// imports the gRPC and proto loader libraries
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// sets the path to the proto file
const PROTO_PATH = __dirname + '/../busstop.proto';
//loads the busstop package from the definition in proto
const proto = grpc.loadPackageDefinition(packageDefinition).busstop;
