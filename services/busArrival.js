const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const PROTO_PATH = __dirname + '/../busstop.proto';

const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const proto = grpc.loadPackageDefinition(packageDefinition).busstop;

function GetBusArrivals(call, callback) {
  const stopId = call.request.stop_id;
  const response = {
    buses: [`#27A - 5 min`, `#46B - 10 min`, `#145 - 12 min`],
  };
  console.log(`[BusArrival] Request for ${stopId}`);
  callback(null, response);
}

const server = new grpc.Server();
server.addService(proto.BusArrivalTracker.service, { GetBusArrivals });

server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
  console.log('BusArrivalTracker running on port 50051');
  server.start();
});