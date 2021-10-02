const Contato = require('../models/ContatoModel');

exports.index = (req, res) => {
  res.render('contato', {
    contato: {}
  });
};

exports.register = async (req, res) => {

  try{
    const contato = new Contato(req.body);
    await contato.register();
    
    if(contato.errors.length > 0){
      req.flash('errors', contato.errors);
      req.session.save(() => res.redirect('back'));
      return;
    }
  
      req.flash('success', "contato registrado com sucesso");
      req.session.save(() => res.redirect(`/contato/index/${contato.contato._id}`));
      return;

  }catch(e){
    console.log(e);
    return res.render('erro404');
  }
};

exports.editIndex = async function(req, res) {

  if(!req.params.id) return res.render('erro404');

  const contato = await Contato.buscaPorId(req.params.id);

  if(!contato) return res.render('erro404');

  res.render('contato', {  contato });

};

exports.edit = async function(req, res) {
  try{
    
    if(!req.params.id) return res.render('erro404');
    const contato = new Contato(req.body);
    await contato.edit(req.params.id);
  
    if(contato.errors.length > 0){
      req.flash('errors', contato.errors);
      req.session.save(() => res.redirect('back'));
      return;
    }
  
      req.flash('success', "contato Editado com sucesso");
      req.session.save(() => res.redirect(`/contato/index/${contato.contato._id}`));
      return;

  }catch(e){
    console.log(e);
    res.render('erro404');
  }
};

exports.delete = async function(req, res) {

  if(!req.params.id) return res.render('erro404');

  const contato = await Contato.delete(req.params.id);

  if(!contato) return res.render('erro404');

  req.flash('success', "contato Apagado com sucesso");
  req.session.save(() => res.redirect('back'));
  return;
};

