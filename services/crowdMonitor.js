const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const PROTO_PATH = __dirname + '/../busstop.proto';

const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const proto = grpc.loadPackageDefinition(packageDefinition).busstop;

function StreamCrowd(call) {
  const stopId = call.request.stop_id;
  console.log(`[CrowdMonitor] Streaming for ${stopId}`);
  let count = 30;