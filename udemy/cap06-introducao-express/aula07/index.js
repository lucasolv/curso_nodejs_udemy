const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.use(
    express.urlencoded({
        extended: true
    })
);

app.use(express.json());

const basepath = path.join(__dirname,'templates');

app.get('/users/add', (req,res)=>{
    res.sendFile(`${basepath}/userform.html`);
});

app.post('/users/save', (req,res)=>{
    console.log(req.body);
    const [name,age] = [req.body.name,req.body.age];
    console.log(`Nome: ${name}, Idade ${age}`);
    res.sendFile(`${basepath}/userform.html`);
});

app.get('/users/:id',(req,res)=>{
    const id = req.params.id;
    console.log(`Estamos busacando pelo usuario ${id}`);
    res.sendFile(`${basepath}/users.html`);
});

app.get('/',(req,res)=>{
    res.sendFile(`${basepath}/index.html`);
});

app.listen(port,()=>{
    console.log(`App rodando na porta ${port}`);
})