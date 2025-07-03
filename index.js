const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./database/datatbase');
const Users = require("./database/TableUsers.js"); // Importando Table 

// Sequelze
connection
    .authenticate()
    .then(() => {
        console.log('Conexão com o banco de dados feita!')
    })
    .catch((msgErro) => {
        console.log('ERRO! ' + msgErro)
    })


// Caminhos para pastas
app.set('view engine', 'ejs')
app.use(express.static('public'));


// Body Parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


// Rotas
app.get("/", (req, res) => {
    res.render('index')
});

app.post("/save", (req, res) => {

    // Guardando os dados inseridos
    let email = req.body.user;  
    let pass = req.body.password;

    Users.create({      // INSERT INTO perguntas ... dados ...
        user: email,
        password: pass
    }).then(() => {
        res.redirect("/") // Voltando para a página principal
    });
    
});


// Server
app.listen(8080, (error) => {
    if(error){
        console.log('Ocorreu algum erro ao iniciar o server')
    }else{
        console.log('Server iniciado!')
    }
});