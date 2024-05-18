const path = require('path')
const express = require('express')
const app = express()
const port = 5000

const basepath = path.join(__dirname,'templates')

const contato = require('./contato')

app.use(express.static('public'))

app.use('/contato',contato)

app.get('/',(req,res)=>{
    res.sendFile(`${basepath}/principal.html`);
});

app.listen(port,()=>{
    console.log(`Servidor rodando na porta ${port}`);
})