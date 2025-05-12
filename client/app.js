const express = require('express');
const path = require('path');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const app = express();
const PORT = 3000;

// load gRPC proto
const PROTO_PATH = path.join(__dirname, '../busstop.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const proto = grpc.loadPackageDefinition(packageDefinition).busstop;

// create gRPC clients
const busClient = new proto.BusArrivalTracker('localhost:50051', grpc.credentials.createInsecure());
const crowdClient = new proto.CrowdMonitor('localhost:50052', grpc.credentials.createInsecure());
const envClient = new proto.EnvironmentMonitor('localhost:50053', grpc.credentials.createInsecure());

// serve static frontend files (HTML/CSS/JS)
app.use(express.static(path.join(__dirname, 'public')));

// keep latest data in memory
let crowdData = { people: 0 };
let envData = { temperature: '--', humidity: '--', aqi: '--' };

// API endpoint: fetch upcoming buses
app.get('/api/buses', (req, res) => {
  busClient.GetBusArrivals({ stop_id: 'stop123' }, (err, response) => {
    if (err) return res.status(500).send('Error fetching bus data');
    res.json(response.buses);
  });
});

// API endpoint - fetch latest crowd data
app.get('/api/crowd', (req, res) => {
  res.json(crowdData);
});

// API endpoint - fetch latest environment data
app.get('/api/env', (req, res) => {
  res.json(envData);
});

// start server
app.listen(PORT, () => {
  console.log(`Dashboard UI running at http://localhost:${PORT}`);
});

// streaming from gRPC to keep data up-to-date

// crowd stream
const stream = crowdClient.StreamCrowd({ stop_id: 'stop123' });
stream.on('data', data => {
  crowdData = { people: data.peopleCount };
});

// environment stream
const envStream = envClient.StreamEnvironment();
setInterval(() => {
  envStream.write({ stop_id: 'stop123' });
}, 5000);
envStream.on('data', data => {
  envData = {
    temperature: data.temperature,
    humidity: data.humidity,
    aqi: data.aqi
  };
});
