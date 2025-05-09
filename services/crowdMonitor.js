// imports the gRPC and proto loader libraries
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// sets the path to the proto file
const PROTO_PATH = __dirname + '/../busstop.proto';

// loads the proto file
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
//loads the busstop package from the definition in proto
const proto = grpc.loadPackageDefinition(packageDefinition).busstop;

// defines the method to simulate the crowd size
function StreamCrowd(call) {
  const stopId = call.request.stop_id;
  console.log(`[CrowdMonitor] Streaming for ${stopId}`);//print statement to explain whats happening
  let count = 30; // starts the count at 30 
// streams through the crowd data every 3 seconds
  const interval = setInterval(() => {
    const crowdData = {
      peopleCount: count + Math.floor(Math.random() * 10), //makes the crowd size change at random
      timestamp: new Date().toISOString(), // adds a timestamp to each retrieval 
    };
    
        call.write(crowdData);
      }, 3000); //sends the data back to the client

    //terminates the stream when the client stops listening
      call.on('end', () => {
        clearInterval(interval);
        call.end(); 
      });
}

// creates an instance of the server
    const server = new grpc.Server();
    // registers the service and method with the server
    server.addService(proto.CrowdMonitor.service, { StreamCrowd });
    //starts the server at the specified port 50052
    server.bindAsync('0.0.0.0:50052', grpc.ServerCredentials.createInsecure(), () => {
      console.log('CrowdMonitor running on port 50052'); // print statement to explain whats happening
      server.start();
    });