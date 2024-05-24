const User = require('../models/UserModel')

exports.register = async (req, res) => {
  try{
    const user = new User(req.body);
    await user.register();

    if(user.errors.length > 0) return res.status(400).send(user.errors);  

    req.session.user = user.user;
    req.session.save();

    res.send({user:user.user, msg:'Usuário cadastrado com sucesso'})
  } catch(e) {
    res.status(500).send(e);
  }
};

exports.login = async(req, res) => {
  try {
    const user = new User(req.body);
    await user.login();;

    if(user.errors.length > 0) return res.status(400).send(user.errors);

    req.session.user = user.user;
    req.session.save();

    res.send({user: user.user, msg:'Usuário logado com sucesso.'});
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.update = async(req, res) => {
  try {
    if(!req.params.id) return res.status(400).send("Usuário não encontrado.");
    const user = new User(req.body);
    await user.edit(req.params.id);

    if(user.errors.length > 0) return res.status(400).send(user.errors);    

    req.session.user = user.user;
    req.session.save();

    res.send({user: user.user, msg:"Informações editadas com sucesso."});
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.delete = async(req, res) => {
  try {
    if(!req.params.id) return res.status(400).send("Usuário não encontrado");

    const user = new User({});
    const deletedUser = await user.delete(req.params.id);
    if (user.errors.length > 0) return res.status(400).send(userInstance.errors);
    if(!deletedUser) return res.status(400).send("Erro ao deletar usuário.");

    res.send("Usuário deletado com sucesso.");
  } catch (e) {
    res.status(500).send(e)
  }
};