const mongoose = require("mongoose");
let { Schema } = mongoose;

validaNumeros = function(input , numeroDigitos){
    return input.length == numeroDigitos && input.match(/^[0-9]+$/) != null;
}
function getValor(num){
    return (num/100).toFixed(2);
}

function setValor(num){
    return num*100;
}

let financeiroSchema = new Schema(
  {
    cpf: {
      type: String,
      validate: {
        validator: function(cpfInput){
            return validaNumeros(cpfInput , 11)}
      },
    },
    tipo: {
        type: String ,
        enum : ['entrada' , 'saída']
    },
    valor : {
        type : Number , 
        get : getValor , set: setValor
    }
  }
);

let Financeiro = mongoose.model("financeiro", financeiroSchema);

module.exports = Financeiro;