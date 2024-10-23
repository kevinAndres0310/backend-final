import express from 'express';
import handlebars from 'express-handlebars';
import productRouter from './routes/product.router.js';
import cartRouter from './routes/cart.router.js';
import mongoose from 'mongoose';
import __dirname from './utils.js';
import dotenv from 'dotenv';

const app = express();
dotenv.config();

const uriConection = process.env.MONGO_URI;

mongoose
  .connect(uriConection)
  .then(async () => {
    console.log('Conectado a la base de datos');
  })
  .catch(error => {
    console.log('Error al conectar a la base de datos', error);
  });

//Middleware para analizar el cuerpo de las solicitudes
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Config Handlebars
app.set('views', __dirname + '/views');
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');

// Carpeta public estatica
app.use(express.static(__dirname + '/public'));

//Implementar los routers
app.use('/product', productRouter);
app.get('/newProduct', (req, res) => {
  res.render('newProduct');
});
app.use('/carts', cartRouter);

const httpServer = app.listen(8080, () => {
  console.log('Listening in Port 8080');
});

//clave mongo DB xwZNo68lkqHQwNVw
