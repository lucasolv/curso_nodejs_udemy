const express = require('express')
const exphbs = require('express-handlebars')

const app = express()

const hbs = exphbs.create({
    partialsDir: ["views/partials"]
})

app.engine('handlebars',hbs.engine)
app.set('view engine','handlebars')

app.get('/dashboard',(req,res)=>{

    const items = ["item a","item b","item c"]

    res.render('dashboard',{items})
})

app.get('/post',(req,res)=>{

    const post = {
        title: 'Aprender node',
        category: 'JS',
        body: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi adipisci numquam veniam tempora velit explicabo! Excepturi, ea. Assumenda dignissimos maxime commodi optio mollitia. Repellendus ea officia, quod placeat totam culpa?',
        comments: 4
    }

    res.render('blogpost',{post})
})

app.get('/blog',(req,res)=>{
    const posts = [
        {
            title: 'Aprender node',
            category: 'JS',
            body: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi adipisci numquam veniam tempora velit explicabo! Excepturi, ea. Assumenda dignissimos maxime commodi optio mollitia. Repellendus ea officia, quod placeat totam culpa?',
            comments: 4
        },
        {
            title: 'Aprender PHP',
            category: 'PHP',
            body: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi adipisci numquam veniam tempora velit explicabo! Excepturi, ea. Assumenda dignissimos maxime commodi optio mollitia. Repellendus ea officia, quod placeat totam culpa?',
            comments: 15
        },
        {
            title: 'Aprender python',
            category: 'python',
            body: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi adipisci numquam veniam tempora velit explicabo! Excepturi, ea. Assumenda dignissimos maxime commodi optio mollitia. Repellendus ea officia, quod placeat totam culpa?',
            comments: 6
        }
    ]

    res.render("blog",{posts})
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