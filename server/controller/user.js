const Security = require('../utils/security');
const Config = require('../utils/config');
const UserDAO = require('../dao/userDAO');

function validateLogin(credentials, user, res){
  if(!!user && Security.compareEncryptPassword({encryptPassword: user.password, password: credentials.password})) {
    res.cookie(Security.jwt_name, Security.generateJWT(user), { httpOnly: true });
    res.send({message: 'login success'});
  } else {
    res.status(403).send({message: 'NOT OKAY MEN!'});
  }
}

function checkJWT(jwt){
  if(!jwt){ //check jwt
    res.clearCookie('cesar_session');
    res.send({auth: false});
  } else if (Date.now() > jwt.expires) { //refresh jwt
      jwt = Security.generateJWT(jwt.user, jwt.expires);
  }
}

module.exports = function(app){

  const userDAO = new UserDAO();

  app.post('/api/login', (req, res) => {
    const credentials = req.body;

    if(credentials.username.includes('@')) {
      userDAO.getByEmail(credentials.username, (user) => {
        validateLogin(credentials, user, res);
      });
    } else {
      userDAO.getByName(credentials.username, (user) => {
        validateLogin(credentials, user, res);
      });
    }
  });

  app.get('/api/logout', (req, res) => {
    res.clearCookie(Security.jwt_name);
    res.sendStatus(200);
  });

  app.get('/api/verify-auth', (req, res) => {
    const jwt = Security.decodeRequestToken(req);
    checkJWT(jwt);
    if(req.query.checkMaster) {
      res.send({auth: jwt.user.master});
    } else {
      res.send({auth: true});
    }
  });

  app.get('/api/generate-password', (req, res) => {
    if (req.query.token === Config.API_TOKEN) {
      const encryptPass = Security.encrypt(req.query.password);
      res.send({password: encryptPass});
    }
    res.send("API Token not valid").status(401);
  });
}
