// imports the gRPC and proto loader libraries
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// sets the path to the proto file
const PROTO_PATH = __dirname + '/../busstop.proto';

// loads the proto file
const packageDefinition = protoLoader.loadSync(PROTO_PATH);

//loads the busstop package from the definition in proto
const proto = grpc.loadPackageDefinition(packageDefinition).busstop;

// defines the method to get bus Arrivals and simulate the times
function GetBusArrivals(call, callback) {
  const stopId = call.request.stop_id; // reads the stop ID
  const response = {
    buses: [`#27A - 5 min`, `#46B - 10 min`, `#145 - 12 min`],
  }; // bus data to return 
  console.log(`[BusArrival] Request for ${stopId}`); //print statement to explain whats happening
  callback(null, response); // sends response back to the client
}

// creates an instance of the server
const server = new grpc.Server();
// registers the service and method with the server
server.addService(proto.BusArrivalTracker.service, { GetBusArrivals });
//starts the server at the specified port 50051
server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
  console.log('BusArrivalTracker running on port 50051'); //print statement to explain whats happening
  server.start();
});