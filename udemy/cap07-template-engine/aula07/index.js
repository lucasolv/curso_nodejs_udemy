const express = require('express')
const exphbs = require('express-handlebars')

const app = express()

app.engine('handlebars',exphbs.engine())
app.set('view engine','handlebars')

app.get('/dashboard',(req,res)=>{

    const items = ["item a","item b","item c"]

    res.render('dashboard',{items})
})

app.get('/post',(req,res)=>{

    const post = {
        tittle: 'Aprender node',
        category: 'JS',
        body: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi adipisci numquam veniam tempora velit explicabo! Excepturi, ea. Assumenda dignissimos maxime commodi optio mollitia. Repellendus ea officia, quod placeat totam culpa?',
        comments: 4
    }

    res.render('blogpost',{post})
})

app.get('/',(req,res)=>{

    const user = {
        name: "silvio",
        surname: "santos",
        age: 30
    }

    const palavra = "teste"

    const auth = false;
    const approved = true;

    res.render('home',{user: user,palavra,auth,approved})
})

app.listen(3000,()=>{
    console.log("App funcionando")
})