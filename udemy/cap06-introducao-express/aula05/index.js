const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

const basepath = path.join(__dirname,'templates');

const checkAuth = function(req,res,next){
    req.authStatus = false;
    if (req.authStatus) {
        console.log('Está logado');
        next();
    } else {
        console.log('Não está logado');
        next();
    }
}

app.use(checkAuth);

app.get('/',(req,res)=>{
    res.sendFile(`${basepath}/index.html`);
});

app.listen(port,()=>{
    console.log(`App rodando na porta ${port}`);
})