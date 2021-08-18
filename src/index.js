import express from 'express';
import path from 'path';
import routerRead from './routes/rutas.js';
import handlebars from 'express-handlebars';
import * as http from 'http';
import io from 'socket.io';


const app = express();
const puerto = 8080;

const server = http.Server(app)

server.listen(puerto, () =>
  console.log('Server up en puerto', puerto)
);
server.on('error', (err) => {
  console.log('ERROR ATAJADO', err);
});

const layoutFolderPath = path.resolve(__dirname, '../views/layouts');
const defaultLayerPath = path.resolve(__dirname, '../views/layouts/index.hbs');
const partialFolderPath = path.resolve(__dirname, '../views/partial');
app.set('view engine', 'hbs');

app.engine(
  'hbs',
  handlebars({
    layoutsDir: layoutFolderPath,
    partialsDir: partialFolderPath,
    defaultLayout: defaultLayerPath,
    extname: 'hbs',
  })
);

const publicPath = path.resolve(__dirname, '../public');
app.use(express.static(publicPath));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', routerRead);

const productos = [];

const myWSServer = io(server);


// myWSServer.on("connection", (socket) => {
//   console.log("Se conecto un cliente");
//   myWSServer.emit("messages", productos);
// });

myWSServer.on('connection', (socket) => {
  console.log('\n\nUn cliente se ha conectado');
  console.log(`ID DEL SOCKET DEL CLIENTE => ${socket.client.id}`);
  console.log(`ID DEL SOCKET DEL SERVER => ${socket.id}`);

  socket.on('new-message', (data) => {
    productos.push(data);
    socket.emit('messages', productos);
  });

  socket.on('askData', (data) => {
    console.log(productos)
    console.log('ME LLEGO DATA');
    socket.emit('messages', productos);
  });  
});