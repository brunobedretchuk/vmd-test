const express = require("express");
const router = express.Router();
const axios = require("axios").default; //serve para fazer requests
const Cliente = require("../models/Cliente.js");
const Financeiro = require("../models/Financeiro.js");

router.get("", async (req, res) => { //rota para get requests que retorna todos os clientes cadastrados
  try {
    let clientes = await Cliente.find().populate("financeiros");
    res.send(displayStuff(clientes));
  } catch (e) {
    res.send(e.message, e.status);
  }
});

router.get("/:cpf", async (req, res) => { //rota para get requests que retorna o cliente pelo cpf
  try {
    let cliente = await Cliente.findOne({ cpf: req.params.cpf }).populate(
      "financeiros"
    );
    res.send(cliente);
  } catch (e) {
    res.send(e.message, e.status);
  }
});

router.post("", async (req, res) => { //rota para post requests que registra um novo cliente no BD
  try {
    let clienteData = req.body;
    let viacepRes = await requestCep(clienteData.endereco.cep);
    if (viacepRes !== undefined) { //verifica se a request retornou algo
      clienteData.endereco = viacepRes;
    }

    let cliente = new Cliente(clienteData);
    console.log(cliente)
    await cliente.save();

    res.send(cliente);

  } catch (e) {
    res.send(e.message, e.status);
  }
});

router.put("/:cpf", async (req, res) => { //rota para put requests que atualiza dados de algum cliente, com excessão do CPF
  try {
    const cliente = await Cliente.findOneAndUpdate(
      { cpf: req.params.cpf } , req.body , { runValidators: true, new: true });
    res.send(cliente);

  } catch (e) {
    res.send(e.message, e.status);
  }
});

router.delete("/:cpf", async (req, res) => { //rota para delete requests que remove algum cliente especificado
  try {
    let { cpf } = req.params;
    const cliente = await Cliente.findOneAndDelete({ cpf: cpf });
    res.send("Objeto Deletado");

  } catch (e) {
    res.send(e.message, e.status);
  }
});

let requestCep = async function (cep) { //função utilizada para fazer requests via axios
  try {
    let res = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
    if (res.data.erro == "true") {
      return null;
    }
    return res.data;
  } catch (e) {
    console.log(e.message);
  }
};

let displayStuff = function(objArr){ // função pra dispor os elementos de maneira um pouco mais legível
  let string = ''
  for (let obj of objArr){
    string += `${obj} <br><br><br>`
  }
  return string
}

module.exports = router;
