const express = require("express");
const router = express.Router();
const Cliente = require("../models/Cliente.js");
const Financeiro = require("../models/Financeiro.js");

router.get("", async (req, res) => { //rota para get requests que retorna todas as transações cadastradas
  try {
    let financeiros = await Financeiro.find();
    res.send(financeiros);
  } catch (e) {
    res.send(e.message, e.status);
  }
});

router.get("/:id", async (req, res) => { //rota para get requests que retorna a transação especificada
  try {
    let { id } = req.params;
    let financeiro = await Financeiro.findById(id);
    res.send(financeiro);
  } catch (e) {
    res.send(e.message, e.status);
  }
});

router.post("", async (req, res) => { //rota para post requests que insere uma nova transação financeira, desde que o CPF requisitado conste no banco de dados
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

router.put("/:id", async (req, res) => { //rota para put requests que modifica uma transação financeira. CPF não pode ser modificado
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

let cpfExisteEmClientes = async function (financeiro) { // verifica se a chave cpf da transação financeira bate com o cpf de algum cliente cadastrado
  let clienteComCpf = await Cliente.findOne({ cpf: financeiro.cpf });
  if (clienteComCpf == null) {
    return false;
  }
  return true;
};

let atualizaSaldoConta = async function (financeiro, tipo , req = {}) { // atualiza o saldo da conta sempre que alguma transação é criada, modificada ou removida do sistema
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

let cadastrarTransacaoEmCliente = async function (financeiro) { // caso a transação seja válida, ela é cadastrada dentro do array "financeiros" de um cliente
  let cliente = await Cliente.findOne({ cpf: financeiro.cpf });
  cliente.financeiros.push(financeiro);
  await cliente.save();
};

let retornaCpfDoCliente = async function (id) { // serve para pegar o cpf do cliente na rota DELETE antes que a transacao seja deletada
  let financeiro = await Financeiro.findById(id);
  return financeiro.cpf;
};

let pegaSinalDoValor = function(financeiro){ // retorna o valor da transação com sinal de positivo ou negativo, a depender do seu tipo (entrada ou saída)
    if(financeiro.tipo == 'entrada'){
        return financeiro.valor
    }
    else if (financeiro.tipo == 'saída'){
        return -financeiro.valor
    }
}

let displayStuff = function(objArr){ // função pra dispor os elementos de maneira um pouco mais legível
  let string = ''
  for (let obj of objArr){
    string += `${obj} <br><br>`
  }
  return string
}

module.exports = router;
