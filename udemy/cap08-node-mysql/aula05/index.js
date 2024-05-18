const express = require('express')
const exphbs = require('express-handlebars')
const mysql = require('mysql2')

const app = express()

app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.json())

const hbs = exphbs.create({
    partialsDir: ["views/partials"]
})

app.engine('handlebars',hbs.engine)
app.set('view engine','handlebars')

app.use(express.static('public'))

app.get('/',(req,res)=>{
    res.render('home')
})

app.post('/books/insertbook',(req,res)=>{
    const title = req.body.title
    const pageqty = req.body.pageqty

    const sql = `INSERT INTO books (title, pageqty) VALUES ('${title}', '${pageqty}')`

    conn.query(sql,function(err){
        if(err){
            console.log(err)
            return
        }   
        res.redirect('/books')
        
    })
})

app.post('/books/updatebook',(req,res)=>{
    const id = req.body.id
    const title = req.body.title
    const pageqty = req.body.pageqty

    const sql = `UPDATE books SET title = '${title}', pageqty = '${pageqty}' WHERE id = ${id}`

    conn.query(sql,function(err){
        if(err){
            console.log(err)
            return
        }   
        res.redirect('/books')
        
    })
})

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345678',
    database: 'nodemysql2'
})

app.get('/books',(req,res)=>{
    const sql = 'SELECT * FROM books'
    conn.query(sql,function(err,data){
        if(err){
            console.log(err)
            return
        }   
        const books = data
        console.log(books)

        res.render('books',{books})
        
    })
})

app.get('/books/:id',(req,res)=>{
    const id = req.params.id

    const sql = `SELECT * FROM books WHERE id = ${id}`

    conn.query(sql,function(err,data){
        if(err){
            console.log(err)
            return
        }   
        const book = data[0]

        res.render('book',{book})
        
    })
})

app.get('/books/edit/:id',(req,res)=>{
    const id = req.params.id

    const sql = `SELECT * FROM books WHERE id = ${id}`

    conn.query(sql,function(err,data){
        if(err){
            console.log(err)
            return
        }   
        const book = data[0]

        res.render('editbook',{book})
    })
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