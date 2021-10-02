require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');


// faz a conexão com o banco de dados MongoDB.
mongoose.connect(process.env.CONNECTIONSTRING)
.then(() => {
    console.log("agora que ocorreu a conexão.");
    app.emit('pronto');
})
.catch((e) => {
    console.log(e);
});
// mongoose.connect(process.env.CONNECTIONSTRING,
//     {
//       useNewUrlParser: false,
//       useUnifiedTopology: false,
//       useFindAndModify: false
//     })
//     .then(() => {
//       app.emit('pronto');
//     })
//     .catch(e => console.log(e));

const session = require('express-session');
const MongoStore = require('connect-mongo'); //salva as sessões na base de dados.
const flash = require('connect-flash'); //flash mensagens, mensagens auto destrutivas
// const helmet = require('helmet'); //parametro de seguraça para a aplicação
const csrf = require('csurf'); // responsavel pela segurança das rotas da aplicação

//define as rotas no arquivo de rotas e o chama os midlewares
const routes = require('./routes'); 
const path = require('path');
const { middlewareGlobal, csrvError, csrfMidlleware } = require('./src/midleware/midleware');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'public')));

//faz storage com o BD
const sessionOptions = session({
    secret: 'akasdfj0út23453456+54qt23qv  qwf qwer qwer qewr asdasdasda a6()',
    store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        //determina quanto tempo vai ficar salva esse storage
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true
    }
  });

  app.use(sessionOptions);
  app.use(flash());
//   app.use(helmet());

app.set('views', path.resolve(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

app.use(csrf());
//Nossos proprios Midlewares
app.use(middlewareGlobal);
app.use(csrvError);
app.use(csrfMidlleware);
app.use(routes);

//estrutura que liga e escuta, o servidor na porta {3000}
app.on('pronto', () => {
    
    app.listen(3000, () => {
        console.log('"acessar localhost.com:3000"');
        console.log('"test"');
    });
    
})