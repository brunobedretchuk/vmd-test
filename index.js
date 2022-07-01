const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const Cliente = require('./models/Cliente.js')
const Financeiro = require('./models/Financeiro.js')

//rotas das collections estão nos respectivos arquivos da pasta routes
let clienteRoutes = require('./routes/clientes')
let financeiroRoutes = require('./routes/financeiros')


const port = 3001;
const config = require("./config");
const dbUrl = config.dbUrl;

// const clientesRouter = require("./routes/clientes");

var options = {
  keepAlive: true,
  connectTimeoutMS: 30000,
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

//conecta ao banco de dados hospedado no mongoAtlas
mongoose.connect(dbUrl, options, (err) => {
  if (err) console.log(err);
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/clientes' , clienteRoutes)
app.use('/financeiros' , financeiroRoutes)



app.listen(port, function () {
  console.log("Runnning on " + port);
});
module.exports = app;



