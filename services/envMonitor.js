// imports the gRPC and proto loader libraries
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// sets the path to the proto file
const PROTO_PATH = __dirname + '/../busstop.proto';
//loads the busstop package from the definition in proto
const proto = grpc.loadPackageDefinition(packageDefinition).busstop;

// sets up method to respond with environemnt data when client calls
function StreamEnvironment(call) {
  call.on('data', (req) => {
    const envData = {
      temperature: Math.round(15 + Math.random() * 10), //random temp
      humidity: Math.round(60 + Math.random() * 20), //random humidity
      aqi: Math.floor(Math.random() * 100), //random air quality index
      timestamp: new Date().toISOString(), // timestamp
    };
    call.write(envData); // sends the data back to the client
  });

// ends when client terminates the call
  call.on('end', () => call.end());
}

// creates an instance of the server
const server = new grpc.Server();
// registers the service and method with the server
server.addService(proto.EnvironmentMonitor.service, { StreamEnvironment });
  //starts the server at the specified port 50053
server.bindAsync('0.0.0.0:50053', grpc.ServerCredentials.createInsecure(), () => {
  console.log('EnvironmentMonitor running on port 50053'); // print statement to explain whats happening
  server.start();
});