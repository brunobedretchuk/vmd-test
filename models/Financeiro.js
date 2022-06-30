const mongoose = require("mongoose");
let { Schema } = mongoose;

validaNumeros = function(input , numeroDigitos){
  let regex =   /^[0-9]+$/;
  return input.length == numeroDigitos && input.match(regex) != null;
}
validaData = function(input){
  let regex =   /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/
  return input.match(regex) != null
}

function setValor(num){
    return (parseFloat(num)).toFixed(2);
}

let financeiroSchema = new Schema(
  {
    cpf: {
      type: String,
      immutable: true,
      required: true,
      validate: {
        validator: function(cpfInput){
            return validaNumeros(cpfInput , 11)}
      },
    },
    tipo: {
        type: String ,
        required: true,
        enum : ['entrada' , 'saída']
    },
    valor : {
        type : Number,
        set: setValor,
        required: true,
        min: 0
    },
    data : {
      type: String,
      required: true,
      validate: {
        validator: function(dataInput){
          return validaData(dataInput)
        } 
      }
    }
  }
);

let Financeiro = mongoose.model("Financeiro", financeiroSchema);

module.exports = Financeiro;