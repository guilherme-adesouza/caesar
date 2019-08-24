const Security = require('../utils/security');
const Config = require('../utils/config');
const UserDAO = require('../dao/userDAO');

function validateLogin(credentials, user, res){
  if(!!user && user.active && Security.compareEncryptPassword({encryptPassword: user.password, password: credentials.password})) {
    res.cookie(Security.jwt_name, Security.generateJWT(user), { httpOnly: true });
    delete user.password;
    delete user.active;
    res.send({user});
  } else {
    res.status(403).send({message: 'Credentials not valid'});
  }
}

function checkJWT(jwt, res){
  if(!jwt){ //check jwt
    res.clearCookie('cesar_session');
    res.send({auth: false});
    return false;
  }
  return jwt;
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
      userDAO.getByUsername(credentials.username, (user) => {
        validateLogin(credentials, user, res);
      });
    }
  });

  app.get('/api/logout', (req, res) => {
    res.clearCookie(Security.jwt_name);
    res.sendStatus(200);
  });

  app.get('/api/verify-auth', (req, res) => {
    let jwt = Security.decodeRequestToken(req);
    jwt = checkJWT(jwt, res);

    if(!!jwt){
      const user = jwt.user;
      if(typeof user === 'object'){
        delete user.password;
        delete user.active;
      }

      if(req.query.checkMaster) {
        res.send({auth: jwt.user.master, user});
      } else {
        res.send({auth: true, user});
      }
    }
  });

  app.get('/api/generate-password', (req, res) => {
    if (req.query.token === Config.API_TOKEN) {
      const encryptPass = Security.encrypt(req.query.password);
      res.send({password: encryptPass});
    }
    res.send("API Token not valid").status(401);
  });
};
