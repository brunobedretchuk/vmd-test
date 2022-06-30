const mongoose = require("mongoose");
let { Schema } = mongoose;
let Financeiro = require('./Financeiro')

validaNumeros = function(input , numeroDigitos){
    return input.length == numeroDigitos && input.match(/^[0-9]+$/) != null;
}

let clienteSchema = new Schema(
  {
    nome: {
      type: String,
      required: true
    },
    cpf: {
      type: String,
      immutable : true,
      validate: {
        validator: function(cpfInput){
            return validaNumeros(cpfInput , 11)}
      },
      unique: true
    },
    endereco: {
      cep: {
        type: String,
        validate: {
            validator: function(cepInput){
                return validaNumeros(cepInput , 8)}
          },
      },
      logradouro: {
        type: String
      },
      cidade: {
        type: String
      },
      uf: {
        type: String,
        minLength: 2,
        maxLength: 2

      }
    },
    telefones: [
        {
            ddd: {
                type: String,
                validate: {
                    validator: function(cpfInput){
                        return validaNumeros(cpfInput , 2)}
                  },
            },
            numero: {
                type: String,
                validate: {
                    validator: function(cpfInput){
                        return validaNumeros(cpfInput , 9)}
                  },
            }
        }
    ],
    financeiros : [{ type: Schema.Types.ObjectId , ref: 'Financeiro'}],

    saldoConta : {
      type : Number,
      default : '0'
    }

  }
);

let Cliente = mongoose.model("Cliente", clienteSchema);

module.exports = Cliente;