require('dotenv').config();

const express = require('express');
const app = express();
const path = require('path');

//Conexão com o Mongo
const mongoose = require('mongoose');

mongoose.connect(process.env.CONNECTIONSTRING)
  .then(() => {
    console.log('Conectado no banco de dados');
    app.emit('Pronto');
  })
  .catch(e => console.log(e));

//Session
const MongoStore = require('connect-mongo');

const session = require('express-session');
app.use(session({
  secret: "#@A4327Asdzw",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl:process.env.CONNECTIONSTRING,
    collectionName: 'sessions'
  })
}));

const cors = require('cors');
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const routes = require('./routes');
app.use("/", routes);

const PORT = process.env.PORT || 3000; // Define a porta padrão caso a variável de ambiente não esteja definida
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
