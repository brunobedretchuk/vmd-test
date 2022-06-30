const express = require("express");
const router = express.Router();
const Cliente = require("../models/Cliente.js");
const Financeiro = require("../models/Financeiro.js");

router.get("", async (req, res) => {
  try {
    let financeiros = await Financeiro.find();
    res.send(financeiros);
  } catch (e) {
    res.send(e.message, e.status);
  }
});

router.get("/:id", async (req, res) => {
  try {
    let { id } = req.params;
    let financeiro = await Financeiro.findById(id);
    res.send(financeiro);
  } catch (e) {
    res.send(e.message, e.status);
  }
});

router.post("", async (req, res) => {
  try {
    let financeiro = new Financeiro(req.body);
    isFinanceiroValid = await cpfExisteEmClientes(financeiro);
    if (isFinanceiroValid) {
        await financeiro.save();
        await cadastrarTransacaoEmCliente(financeiro);
      atualizaSaldoConta(financeiro, "criar");
      res.send("Objeto criado!");
    } else if (!isFinanceiroValid) {
      throw "Desculpe, o cpf indicado não está registrado no banco de clientes";
    }
  } catch (e) {
    res.send(e);
  }
});

router.put("/:id", async (req, res) => {
  try {
    if (req.body.cpf === undefined) {
      const financeiro = await Financeiro.findOneAndUpdate(
        { id: req.params.id },
        req.body,
        { runValidators: true}
        );
        atualizaSaldoConta(financeiro , 'atualizar' , req)
      res.send(financeiro);
    } else if (req.body !== undefined) {
      let error = "Você não pode alterar o CPF de uma transação financeira!";
      throw error;
    }
  } catch (e) {
    res.send(e);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    let { id } = req.params;

    const pegarCpf = await retornaCpfDoCliente(id);
    const financeiro = await Financeiro.findByIdAndDelete(id)
    
    atualizaSaldoConta(financeiro, "deletar");
    const cliente = await Cliente.findOne({ cpf: pegarCpf });
    const newFinArr = {
      financeiros: cliente.financeiros.filter((el) => el.toString() !== id),
    };
    await cliente.updateOne(newFinArr);
    res.send("Objeto deletado!");
  } catch (e) {
    res.send(e.message, e.status);
  }
});

let cpfExisteEmClientes = async function (financeiro) {
  let clienteComCpf = await Cliente.findOne({ cpf: financeiro.cpf });
  if (clienteComCpf == null) {
    return false;
  }
  return true;
};

let atualizaSaldoConta = async function (financeiro, tipo , req = {}) {
    let cliente = await Cliente.findOne({ cpf: financeiro.cpf });
  if (tipo == "criar") {
    let valor = pegaSinalDoValor(financeiro)
    cliente.saldoConta += valor;
    await cliente.save();
  }
  else if (tipo == "deletar") {
    let valor = pegaSinalDoValor(financeiro)
      cliente.saldoConta -= valor;
      await cliente.save();
  }
  else if (tipo == "atualizar"){
    let valorInicial = pegaSinalDoValor(financeiro)
    let objetoParaValorFinal = req.body
    if ( objetoParaValorFinal.tipo == undefined){
        objetoParaValorFinal.tipo = financeiro.tipo
    }
    if(objetoParaValorFinal.valor == undefined){
        objetoParaValorFinal.valor = financeiro.valor
    }
    let valorFinal = pegaSinalDoValor(objetoParaValorFinal)
    let deltaValor = valorFinal - valorInicial
    cliente.saldoConta += deltaValor
    await cliente.save()
  }
};

let cadastrarTransacaoEmCliente = async function (financeiro) {
  let cliente = await Cliente.findOne({ cpf: financeiro.cpf });
  cliente.financeiros.push(financeiro);
  await cliente.save();
};

let retornaCpfDoCliente = async function (id) {
  let financeiro = await Financeiro.findById(id);
  return financeiro.cpf;
};

let pegaSinalDoValor = function(financeiro){
    if(financeiro.tipo == 'entrada'){
        return financeiro.valor
    }
    else if (financeiro.tipo == 'saída'){
        return -financeiro.valor
    }
}

module.exports = router;
