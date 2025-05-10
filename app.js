const express = require('express');
const path = require('path');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const app = express();
const PROTO_PATH = path.join(__dirname, '../busstop.proto');

const packageDef = protoLoader.loadSync(PROTO_PATH);
const proto = grpc.loadPackageDefinition(packageDef).busstop;

const busClient = new proto.BusArrivalTracker('localhost:50051', grpc.credentials.createInsecure());
const crowdClient = new proto.CrowdMonitor('localhost:50052', grpc.credentials.createInsecure());
const envClient = new proto.EnvironmentMonitor('localhost:50053', grpc.credentials.createInsecure());

app.use(express.static(path.join(__dirname, 'public')));

let crowd = 0;
let environment = { temperature: '--', humidity: '--', aqi: '--' };

app.get('/api/buses', (req, res) => {
  busClient.GetBusArrivals({ stop_id: 'stop123' }, (err, response) => {
    if (err) return res.status(500).send(err);
    res.json(response.buses);
  });
});

app.get('/api/crowd', (req, res) => {
  res.json({ people: crowd });
});

app.get('/api/env', (req, res) => {
  res.json(environment);
});

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
