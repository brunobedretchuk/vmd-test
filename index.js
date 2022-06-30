const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Cliente = require('./models/Cliente.js')
const Financeiro = require('./models/Financeiro.js')
let clienteRoutes = require('./routes/clientes')


const port = 3001;
const config = require("./config");

// const clientesRouter = require("./routes/clientes");

const dbUrl = config.dbUrl;

var options = {
  keepAlive: true,
  connectTimeoutMS: 30000,
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.connect(dbUrl, options, (err) => {
  if (err) console.log(err);
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/clientes' , clienteRoutes)



app.listen(port, function () {
  console.log("Runnning on " + port);
});
module.exports = app;


// let clientes = [
//   {
//     endereco: {
//       cep: '88115900',
//       logradouro: 'rua teste alguma 2',
//       cidade: 'Biguaçu',
//       uf : 'SC'
//     },
//     nome: 'Alvaro Nobrega',
//     cpf: '12345678912',
//     telefones: [ {ddd : '55' , numero : '999999999'}],
//   },
//   {
//     endereco: {
//       cep: '88115900',
//       logradouro: 'rua teste alguma 2',
//       cidade: 'Biguaçu',
//       uf : 'SC'
//     },
//     nome: 'Balthazar Silva',
//     cpf: '98765432132',
//     telefones: [ {ddd : '55' , numero : '999999999'}],
//   },
//   {
//     endereco: {
//       cep: '88115900',
//       logradouro: 'rua teste alguma 2',
//       cidade: 'Biguaçu',
//       uf : 'SC'
//     },
//     nome: 'Luana Duarte',
//     cpf: '96385274123',
//     telefones: [ {ddd : '55' , numero : '999999999'}],
//   },
//   {
//     endereco: {
//       cep: '88115900',
//       logradouro: 'rua teste alguma 2',
//       cidade: 'Biguaçu',
//       uf : 'SC'
//     },
//     nome: 'Rock Linderson',
//     cpf: '74185296398',
//     telefones: [ {ddd : '55' , numero : '999999999'}],
//   },
// ]

// Cliente.insertMany(clientes)



