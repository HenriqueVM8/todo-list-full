const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./database/datatbase');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const Users = require("./database/TableUsers.js"); // Importando Table 

const Task = require('./database/Tasks');

Task.sync();

// Sequelze
connection
    .authenticate()
    .then(() => {
        console.log('Conexão com o banco de dados feita!')
    })
    .catch((msgErro) => {
        console.log('ERRO! ' + msgErro)
    })


app.use(session({
    secret: 'segredoqualquer',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 600000 } // Sessão expira em 10 minutos
}));  

// Caminhos para pastas
app.set('view engine', 'ejs')
app.use(express.static('public'));


// Body Parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Middleware para tornar o usuário disponível nas views (opcional)
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

function ensureAuthenticated(req, res, next) {
  if (req.session.user) {
    next(); // Usuário logado, segue em frente
  } else {
    res.redirect('/login'); // Se não estiver logado, manda para a rota login
  }
}

// Rotas
app.get("/", async (req, res) => {
  if (!req.session.user) {
    return res.render('index', { tasks: [] });
  }
  const userId = req.session.user.id;

  try {
    const tasks = await Task.findAll({ where: { userId } });
    res.render('index', { tasks });
  } catch (err) {
    console.error(err);
    res.render('index', { tasks: [] });
  }
});

app.post("/save", async (req, res) => {
    let email = req.body.user;  
    let pass = req.body.password;

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(pass, salt);

        await Users.create({
            user: email,
            password: hashedPass
        });

        res.redirect("/");
    } catch (error) {
        console.log("Erro ao salvar usuário: ", error);
        res.send("Erro ao registrar usuário");
    }
});

app.post("/tasks/add", ensureAuthenticated, async (req, res) => {
  const title = req.body.input;
  const userId = req.session.user.id;
  try {
    const task = await Task.create({ title, userId });
    res.json(task); // Retorna o objeto criado com o id
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao adicionar tarefa");
  }
});

// Editar título da tarefa
app.patch('/tasks/:id/edit', ensureAuthenticated, async (req, res) => {
  const taskId = req.params.id;
  const { title } = req.body;
  const userId = req.session.user.id;

  try {
    const task = await Task.findOne({ where: { id: taskId, userId } });
    if (!task) {
      console.log("Tarefa não encontrada no banco");
      return res.status(404).send('Tarefa não encontrada');
    }

    await task.update({ title });   
    console.log("Tarefa atualizada com sucesso");
    res.sendStatus(200);
  } catch (err) {
    console.error("Erro ao atualizar tarefa:", err);
    res.status(500).send('Erro ao editar tarefa');
  }
});

// Deletar tarefa
app.delete('/tasks/:id/delete', ensureAuthenticated, async (req, res) => {
  const taskId = req.params.id;
  const userId = req.session.user.id;

  try {
    const task = await Task.findOne({ where: { id: taskId, userId } });
    if (!task) return res.status(404).send('Tarefa não encontrada');

    await task.destroy();     
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao deletar tarefa');
  }
});

// Alternar status da tarefa (done)
app.patch('/tasks/:id/toggle', ensureAuthenticated, async (req, res) => {
  const taskId = req.params.id;
  const userId = req.session.user.id;

  try {
    const task = await Task.findOne({ where: { id: taskId, userId } });
    if (!task) return res.status(404).send('Tarefa não encontrada');

    await task.update({ done: !task.done });
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao atualizar status da tarefa');
  }
});

// Login de usuário
app.post("/login", async (req, res) => {
    const email = req.body.usuario;
    const senha = req.body.senha;

    try {
        const user = await Users.findOne({ where: { user: email } });

        if (user != undefined) {
            const senhaCorreta = await bcrypt.compare(senha, user.password);
            if (senhaCorreta) {
                // Salva usuário na sessão
                req.session.user = { id: user.id, email: user.user };
                return res.redirect("/");
            }
        }

        res.send("Usuário ou senha inválidos.");
    } catch (error) {
        console.log("Erro no login: ", error);
        res.send("Erro no processo de login.");
    }
});;

app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.log('Erro ao fazer logout:', err);
      return res.send("Erro ao fazer logout");
    }
    res.redirect('/');  // redireciona para a página principal após logout
  });
});


// Server

connection.sync()
  .then(() => {
    console.log("Tabelas sincronizadas com sucesso!");
    // Inicie o servidor só depois que as tabelas estiverem prontas
    app.listen(8080, (error) => {
      if(error){
        console.log('Ocorreu algum erro ao iniciar o server');
      } else {
        console.log('Server iniciado!');
      }
    });
  })
  .catch((error) => {
    console.log("Erro ao sincronizar as tabelas:", error);
  });
  
/*app.listen(8080, (error) => {
    if(error){
        console.log('Ocorreu algum erro ao iniciar o server')
    }else{
        console.log('Server iniciado!')
    }
});*/