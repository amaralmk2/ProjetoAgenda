const mongoose = require('mongoose');
const validator = require('validator');

const ContatoSchema = new mongoose.Schema({
    nome: {type: String, require: true},
    sobrenome: {type: String, require: false, default: ''},
    email: {type: String, require: false, default: ''},
    telefone: {type: String, require: false, default: ''},
    criadoEm: {type: Date, default: Date.now },
});

const ContatoModel = mongoose.model('Contato', ContatoSchema);

function Contato(body) {
    this.body = body;
    this.errors = [];
    this.contato = null;
}

Contato.buscaPorId = async function(id){
  if(typeof id !== 'string') return;
  const contato = await ContatoModel.findById(id);
  return contato;
}

Contato.prototype.register = async function() {
  this.valida();
  if(this.errors > 0) return;
  this.contato = await ContatoModel.create(this.body);
};

Contato.prototype.valida = function() {
  //verifica se é um email valido com o pacote validator.
  this.CleanUp();
  if(this.body.email && !validator.isEmail(this.body.email)) this.errors.push('E-mail inválido!');
  if(!this.body.nome) this.errors.push("é preciso inserir o nome!");
  if(!this.body.email && !this.body.telefone){
  this.errors.push("é preciso ter email ou telefone.");
  } 
  
};

Contato.prototype.CleanUp = function(){
  //faz uma tratativa para verificar se os dados do formulario não são strings.
  for(const key in this.body){
      if(typeof this.body[key] !== "string") {
          this.body[key] = '';
      }
  }

      this.body = {
          nome: this.body.nome,
          sobrenome: this.body.sobrenome,
          email: this.body.email,
          telefone: this.body.telefone,
      };
}

Contato.prototype.edit = async function(id){

  if(typeof id !== 'string') return;
  this.valida();
  if(this.errors.length > 0) return;
  this.contato = await ContatoModel.findByIdAndUpdate(id, this.body, { new: true});

};

// Contato.buscaPorId = async function(id){
//   if(typeof id !== 'string') return;
//   const contato = await ContatoModel.findById(id);
//   return contato;
// };

Contato.buscaContatos = async function(id){
  

  const contatos = await ContatoModel.find()
  .sort({ criadoEm: -1});
  return contatos;
};

Contato.delete = async function(id){
  
  if(typeof id !== 'string') return;
  const contatos = await ContatoModel.findOneAndDelete({_id: id});
  return contatos;
};

module.exports = Contato;