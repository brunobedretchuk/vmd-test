const express = require('express');
const router = express.Router();
const Cliente = require('../models/Cliente.js')
const Financeiro = require('../models/Financeiro.js')

router.get('', async (req,res) => {
    try{
      let clientes = await Cliente.find().populate('financeiros');  
          res.send(clientes);
  
    }catch (e){ 
      res.send(e.message , e.status)
    }
  })
router.get('/:cpf', async (req,res) => {
    try{
      let cliente = await Cliente.findOne( {cpf : req.params.cpf} ).populate('financeiros');  
          res.send(cliente);
  
    }catch (e){ 
      res.send(e.message , e.status)
    }
  })
  
  router.post('', async (req,res) => {
    try{
      let cliente = new Cliente(req.body);
      cliente = await cliente.save();
    }
    catch (e){
      res.send(e.message , e.status)
  }
  })
  
  router.put('/:cpf' , async (req,res) => {
    try{
      const cliente = await Cliente.findOneAndUpdate(
        { cpf : req.params.cpf} , req.body , {runValidators:true, new:true })
      res.send(cliente)
  
    }catch (e){res.send(e.message , e.status)}
  })
  
  router.delete('//:cpf' , async (req,res) => {
    try{
      let {cpf} = req.params
      const cliente = await Cliente.findOneAndDelete(
        { cpf : cpf})
      res.redirect('')
  
    } catch (e){res.send(e.message , e.status)}
  })
module.exports = router;
