module.exports.loginRequired = (req, res, next) => {
  if(req.session && req.session.user) {
    next();
  } 
  res.status(401).send('Você precisa fazer login para acessar a página');
};