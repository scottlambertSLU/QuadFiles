evar http = require('http');
var fs = require('fs');
var index = fs.readFileSync( 'index1.html');
var index2 = fs.readFileSync( 'quadrilateral_en_adapted-from-phet.html');

var SerialPort = require('serialport');
const parsers = SerialPort.parsers;

const parser = new parsers.Readline({
  delimiter: '\r\n'
});

var port = new SerialPort('//dev/cu.usbmodem11201',{ 
  baudRate: 9600,
  dataBits: 8,
  parity: 'none',
  stopBits: 1,
  flowControl: false
});

port.pipe(parser);

var app = http.createServer(function(req, res) {
  console.log(req.url);
  if (req.url === '/') {

  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(index);

  }
  else {
    res.writeHead(200, {'Content-Type': 'text/html'});

    res.end(index2);
  }
});


const io = require('socket.io')(app, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        transports: ['websocket', 'polling'],
        credentials: true
    },
    allowEIO3: true
});

/*var io = require('socket.io')(app);

io.on('connection', function(socket) {
    
  console.log('Node is listening to port');
    
});
*/
parser.on('data', function(data) {
  //jdat = parseData(data);  
  //console.log('Received data from port: ' + data);
  io.emit('data', data);
    
});

io.on('connection', (socket) => {
    console.log('connected');

    socket.on("message", (data)=>{
        console.log(data)
    })
});



app.listen(3000);



function parseData(jdata) {
    console.log(jdata);
    pdata = JSON.parse(jdata);
    var angle1 = pdata.angle1;
    var angle2 = pdata.angle2;
    var angle3 = pdata.angle3;
    var angle4 = pdata.angle4;

    var length1 = pdata.length1;
    var length2 = pdata.length2;
    var length3 = pdata.length3;
    var length4 = pdata.length4;
    
} 
