const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const PROTO_PATH = __dirname + '/../busstop.proto';

const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const proto = grpc.loadPackageDefinition(packageDefinition).busstop;

function StreamCrowd(call) {
  const stopId = call.request.stop_id;
  console.log(`[CrowdMonitor] Streaming for ${stopId}`);
  let count = 30;

  const interval = setInterval(() => {
    const crowdData = {
      peopleCount: count + Math.floor(Math.random() * 10),
      timestamp: new Date().toISOString(),
    };
    
        call.write(crowdData);
      }, 3000);
    
      call.on('end', () => {
        clearInterval(interval);
        call.end();
      });
}

    const server = new grpc.Server();
    server.addService(proto.CrowdMonitor.service, { StreamCrowd });
    
    server.bindAsync('0.0.0.0:50052', grpc.ServerCredentials.createInsecure(), () => {
      console.log('CrowdMonitor running on port 50052');
      server.start();
    });