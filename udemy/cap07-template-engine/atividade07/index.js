const express = require('express')
const exphbs = require('express-handlebars')

const port = 3000

const app = express()
const hbs = exphbs.create({
    partialsDir: ["views/partials"]
})

app.engine('handlebars',hbs.engine)
app.set('view engine','handlebars')

app.use(express.static('public'))

const products = [
    {
        id: '1',
        title: 'Livro',
        price: 12.99
    },
    {
        id: '2',
        title: 'Cadeira',
        price: 200.99
    },
    {
        id: '3',
        title: 'Lampada',
        price: 2.99
    }
]

app.get('/',(req,res)=>{
    res.render('home',{products})
})

app.get('/product/:id',(req,res)=>{

    const product = products[parseInt(req.params.id - 1)]

    res.render('product',{product})
})



app.listen(port,()=>{
    console.log(`Servidor rodando na porta ${port}`)
})