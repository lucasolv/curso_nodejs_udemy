const express = require('express');
const router = express.Router();
const path = require('path');

const basepath = path.join(__dirname,'../templates');

router.get('/add', (req,res)=>{
    res.sendFile(`${basepath}/userform.html`);
});

router.post('/save', (req,res)=>{
    console.log(req.body);
    const [name,age] = [req.body.name,req.body.age];
    console.log(`Nome: ${name}, Idade ${age}`);
    res.sendFile(`${basepath}/userform.html`);
});

router.get('/:id',(req,res)=>{
    const id = req.params.id;
    console.log(`Estamos busacando pelo usuario ${id}`);
    res.sendFile(`${basepath}/users.html`);
});

module.exports = router;