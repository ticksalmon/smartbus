const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const readline = require('readline');

const PROTO_PATH = __dirname + '/../busstop.proto';
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const proto = grpc.loadPackageDefinition(packageDefinition).busstop;

const busClient = new proto.BusArrivalTracker('localhost:50051', grpc.credentials.createInsecure());
const crowdClient = new proto.CrowdMonitor('localhost:50052', grpc.credentials.createInsecure());
const envClient = new proto.EnvironmentMonitor('localhost:50053', grpc.credentials.createInsecure());

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Enter Bus Stop ID: ", (stopId) => {
  busClient.GetBusArrivals({ stop_id: stopId }, (err, res) => {
    console.log("\nUpcoming Buses:", res.buses);
  });

  const stream = crowdClient.StreamCrowd({ stop_id: stopId });
 stream.on('data', data => {
  console.log("Crowd data received:", data);
});

  const envStream = envClient.StreamEnvironment();
  setInterval(() => {
    envStream.write({ stop_id: stopId });
  }, 5000);

  envStream.on('data', (data) => {
    console.log(`[Env] Temp: ${data.temperature}°C, AQI: ${data.aqi} at ${data.timestamp}`);
  });
});