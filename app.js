
//imports gRPC modules and Node.js 
const express = require('express');
const path = require('path');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
//starts express app
const app = express();
//defines path to proto buffers
const PROTO_PATH = path.join(__dirname, '../busstop.proto');
//loads the proto file
const packageDef = protoLoader.loadSync(PROTO_PATH);
//converts into an object
const proto = grpc.loadPackageDefinition(packageDef).busstop;

//creates gRPC client to connect to each service
const busClient = new proto.BusArrivalTracker('localhost:50051', grpc.credentials.createInsecure());
const crowdClient = new proto.CrowdMonitor('localhost:50052', grpc.credentials.createInsecure());
const envClient = new proto.EnvironmentMonitor('localhost:50053', grpc.credentials.createInsecure());

app.use(express.static(path.join(__dirname, 'public')));

let crowd = 0; //sets crowd count to 0
let environment = { temperature: '--', humidity: '--', aqi: '--' }; //sets environment markers to null/empty

//defines the endpoint for REST API to get bus arrival data - returns bus data
app.get('/api/buses', (req, res) => {
  busClient.GetBusArrivals({ stop_id: 'stop123' }, (err, response) => {
    if (err) return res.status(500).send(err);
    res.json(response.buses);
  });
});

//defines the endpoint for REST API to get crowd data - returns crowd data
app.get('/api/crowd', (req, res) => {
  res.json({ people: crowd });
});
//defines the endpoint for REST API to get environment data - returns env data
app.get('/api/env', (req, res) => {
  res.json(environment);
});

//starts the express server on port 3000
app.listen(3000, () => {
  console.log('Dashboard UI running at http://localhost:3000');
});


const streamCrowd = crowdClient.StreamCrowd({ stop_id: 'stop123' });
streamCrowd.on('data', data => {
  crowd = data.peopleCount;
});

const envStream = envClient.StreamEnvironment();
setInterval(() => {
  envStream.write({ stop_id: 'stop123' });
}, 3000);
envStream.on('data', data => {
  environment = {
    temperature: data.temperature,
    humidity: data.humidity,
    aqi: data.aqi
  };
});
