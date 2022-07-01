const mongoose = require("mongoose");
let { Schema } = mongoose;
let Financeiro = require("./Financeiro");

validaNumeros = function (input, numeroDigitos) {
  //usado para verificar se o input contém apenas dígitos numéricos e possui o length correto
  return input.length == numeroDigitos && input.match(/^[0-9]+$/) != null;
};

validaCep = function (input) {
  //usado para verificar se o input de cep está no modelo correto
  let regex = /^[0-9]{5}-[0-9]{3}$/;
  return input.length == 9 && input.match(regex) != null;
};

let clienteSchema = new Schema({
  nome: {
    type: String,
    required: true,
  },
  cpf: {
    type: String,
    immutable: true,
    validate: {
      validator: function (cpfInput) {
        return validaNumeros(cpfInput, 11);
      },
    },
    unique: true,
  },
  endereco: {
    cep: {
      type: String,
      required: true,
      validate: {
        validator: function (cepInput) {
          return validaCep(cepInput);
        },
      },
    },
    logradouro: {
      type: String,
      default: "",
    },
    localidade: {
      type: String,
      default: "",
    },
    uf: {
      type: String,
      maxLength: 2,
      default: "",
    },
  },
  telefones: [
    {
      ddd: {
        type: String,
        validate: {
          validator: function (cpfInput) {
            return validaNumeros(cpfInput, 2);
          },
        },
      },
      numero: {
        type: String,
        validate: {
          validator: function (telInput) {
            return validaNumeros(telInput, 9);
          },
        },
      },
    },
  ],
  financeiros: [{ type: Schema.Types.ObjectId, ref: "Financeiro" }],

  saldoConta: {
    type: Number,
    default: "0",
  },
});

let Cliente = mongoose.model("Cliente", clienteSchema);

module.exports = Cliente;
