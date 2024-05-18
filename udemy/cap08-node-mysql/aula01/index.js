const express = require('express')
const exphbs = require('express-handlebars')
const mysql = require('mysql2')

const app = express()

const hbs = exphbs.create({
    partialsDir: ["views/partials"]
})

app.engine('handlebars',hbs.engine)
app.set('view engine','handlebars')

app.use(express.static('public'))

app.get('/',(req,res)=>{
    res.render('home')
})

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345678',
    database: 'nodemysql2'
})

conn.connect(function(err){
    if(err){
        console.log(err)
        console.log('ERRO')
    }else{   
        console.log('Conectou ao MySQL')
    }

    app.listen(3000)
})