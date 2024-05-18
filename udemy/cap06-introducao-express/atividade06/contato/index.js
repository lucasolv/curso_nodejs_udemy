const express = require('express')
const router = express.Router()
const path = require('path')

const basepath = path.join(__dirname,'../templates');

router.get('/',(req,res)=>{
    res.sendFile(`${basepath}/contatos.html`)
})

module.exports = router;