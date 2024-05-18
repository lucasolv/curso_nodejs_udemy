//const User = require('../models/User')
const pool = require('../db/conn')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
//helpers
const createUserToken = require('../helpers/create-user-token')
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')

module.exports = class UserController{
    static async register(req,res){
        const {name,email,phone,password,confirmpassword,id} = req.body

        //validations
        if(!name){
            res.status(422).json({message: 'O nome é obrigatório'})
            return
        }
        if(!email){
            res.status(422).json({message: 'O e-mail é obrigatório'})
            return
        }
        if(!phone){
            res.status(422).json({message: 'O telefone é obrigatório'})
            return
        }
        if(!password){
            res.status(422).json({message: 'A senha é obrigatória'})
            return
        }
        if(!confirmpassword){
            res.status(422).json({message: 'A confirmação de senha é obrigatória'})
            return
        }
        /* if(!id){
            res.status(422).json({message: 'O id é obrigatório'})
            return
        } */
        if(password !== confirmpassword){
            res.status(422).json({message: 'A senha e a confirmação de senha precisam ser iguais'})
            return
        }

        //check if user exists
        const userExists = function() {
            const sql = `SELECT * FROM users WHERE email = ?;`;
            const data = [email];
            
            return new Promise((resolve, reject) => {
                pool.query(sql, data, function(err, result) {
                    if (err) {
                        //console.error(err);
                        reject(err);
                    } else {
                        //console.log(result);
                        resolve(result);
                    }
                });
            });
        };
        
        // erro ou sucesso
        userExists()
            .then(async result => {
                 if(result[0]){
                    //caso o email ja esteja cadastrado
                    res.status(422).json({message: 'Por favor utilize outro e-mail'})
                    return
                }
                //caso o email nao esteja cadastrado
                //create a password
                const salt = await bcrypt.genSalt(12)
                const passwordHash = await bcrypt.hash(password,salt)
                //console.log(passwordHash)

                //create a user
                const user = {
                    id: id,
                    name: name,
                    email: email,
                    phone: phone,
                    password: passwordHash
                }
                const userSave = function() {
                    const sql = `INSERT INTO users (id,name,email,phone,password) VALUES (?,?,?,?,?);`;
                    const data = [id,name,email,phone,passwordHash];
                    return new Promise((resolve, reject) => {
                        pool.query(sql, data, function(err, result) {
                            if (err) {
                                res.status(500).json({"message":err})
                                reject(err);
                            } else {
                                //console.log(result);
                                resolve(result);
                            }
                        });
                    });
                };
                userSave()
                .then(async result=>{
                    await createUserToken(user,req,res)
                    //console.log("oie")
                })
                .catch(err=>{
                    res.status(500).json({"message":err})
                })
                //res.json({"message":"oie"})
            })
            .catch(err => {
                res.json({"message":err})
            });
    }

    static async login(req,res){
        const {email,password} = req.body

        if(!email){
            res.status(422).json({message: 'O e-mail é obrigatório'})
            return
        }
        if(!password){
            res.status(422).json({message: 'A senha é obrigatória'})
            return
        }

        //check if user exists
        const user = function() {
            const sql = `SELECT * FROM users WHERE email = ?;`;
            const data = [email];
            
            return new Promise((resolve, reject) => {
                pool.query(sql, data, function(err, result) {
                    if (err) {
                        //console.error(err);
                        reject(err);
                    } else {
                        //console.log(result);
                        resolve(result);
                    }
                });
            });
        };

        user()
            .then(async result => {
                if(!result[0]){
                   //caso o email nao esteja cadastrado
                   res.status(422).json({message: 'Não há usuário cadastrado com este e-mail!'})
                   return
                }
                //check if password match with db password

                const checkPassword = await bcrypt.compare(password,result[0].password)

                if(!checkPassword){
                    res.status(422).json({message: 'Senha inválida!'})
                   return
                }

                await createUserToken(result[0],req,res)
            
            })
            .catch(err => {
                res.json({"message":err})
            })

    }

    static async checkUser(req,res){
        let currentUser
        if(req.headers.authorization){
            const token = getToken(req)
            try {
                const decoded = jwt.verify(token,'nossosecret')

            const userQueryId = function() {
                const sql = `SELECT * FROM users WHERE id = ?;`;
                const data = [decoded.id];
                
                return new Promise((resolve, reject) => {
                    pool.query(sql, data, function(err, result) {
                        if (err) {
                            //console.error(err);
                            reject(err);
                        } else {
                            //console.log(result);
                            resolve(result);
                        }
                    });
                });
            };

            userQueryId()
            .then(async result => {
                if(result[0]){
                   //caso ache o id
                   currentUser = result[0]
                   currentUser.password = undefined
                   res.status(200).send(currentUser)
                }
            })
            .catch(err => {
                res.json({"message":err})
            })
            } catch (error) {
                res.json({"message":error})
            }
            
        } else{
            currentUser = null
            res.status(200).send(currentUser)
        }
        
    }

    static async getUserById(req,res){
        const id = req.params.id
        const getUser = function() {
            const sql = `SELECT * FROM users WHERE id = ?;`;
            const data = [id];
            
            return new Promise((resolve, reject) => {
                pool.query(sql, data, function(err, result) {
                    if (err) {
                        //console.error(err);
                        reject(err);
                    } else {
                        //console.log(result);
                        resolve(result);
                    }
                });
            });
        };
        getUser()
            .then(async result => {
                if(!result[0]){
                    res.status(422).json({
                        message: "Usuário não encontrado!"
                    })
                    return
                }
                const user = {
                    "id":result[0].id,
                    "name":result[0].name,
                    "email":result[0].email,
                    "phone":result[0].phone,
                    "image":result[0].image
                }

                res.status(200).json({user})
            })
            .catch(err => {
                res.json({"message":err})
            })
    }

    static async editUser(req,res){
        const id = req.params.id

        //check if user exists
        const token = getToken(req)
        if(!token){
            return res.status(401).json({message:'Acesso negado!'})
        }else{
            const userConsult = async function (){
            
            const decoded = jwt.verify(token,'nossosecret')
            const userId = decoded.id
            const getUser = function() {
                const sql = `SELECT * FROM users WHERE id = ?;`;
                const data = [userId];
                
                return new Promise((resolve, reject) => {
                    pool.query(sql, data, function(err, result) {
                        if (err) {
                            //console.error(err);
                            reject(err);
                        } else {
                            //console.log(result);
                            resolve(result);
                        }
                    });
                });
            };
            getUser()
                .then(async result => {
                    if(!result[0]){
                        //res.status(422).json({message: "Usuário não encontrado!"})
                        return
                    }

                    const user = result[0]

                    const {name,email,phone,password,confirmpassword} = req.body

                    //let image = ''

                    if(req.file){
                        user.image = req.file.filename
                    }

                    //validations

                    if(!name){
                        res.status(422).json({message: 'O nome é obrigatório'})
                        return
                    }
                    user.name = name
            
            
                    if(!email){
                        res.status(422).json({message: 'O e-mail é obrigatório'})
                        return
                    }

                    //check if email has already taken
                    const userExistsByEmail = function() {
                    const sql = `SELECT * FROM users WHERE email = ?;`;
                    const data = [email];
                    return new Promise((resolve, reject) => {
                        pool.query(sql, data, function(err, result) {
                            if (err) {
                                //console.error(err);
                                reject(err);
                            } else {
                                //console.log(result);
                                resolve(result);
                            }
                        });
                    });
                    };
            userExistsByEmail()
            .then(async result=>{
                    //const userResult = result[0]
                    if(result[0] && user.email !== email){
                        res.status(422).json({
                            message: 'Por favor, utilize outro e-mail!'
                        })
                        return
                    }                   
                
                    user.email = email
                    if(!phone){
                        res.status(422).json({message: 'O telefone é obrigatório'})
                        return
                    }
                    user.phone = phone
                    if(password !== confirmpassword){
                        res.status(422).json({message: 'As senhas não conferem!'})
                        return
                    }else if(password === confirmpassword && password != null){
                        //creating password
                        const salt = await bcrypt.genSalt(12)
                        const passwordHash = await bcrypt.hash(password,salt)
                        user.password = passwordHash
                    }
                    try {
                        const updateUser = function() {
                            const sql = `UPDATE users SET name = ?, email = ?, phone = ?, password = ?, image = ? WHERE id = ?;`;
                            const data = [user.name,user.email,user.phone,user.password,user.image,user.id];
                            
                            return new Promise((resolve, reject) => {
                                pool.query(sql, data, function(err, result) {
                                    if (err) {
                                        //console.error(err);
                                        reject(err);
                                    } else {
                                        //console.log(result);
                                        resolve(result);
                                    }
                                });
                            });
                        };
                        updateUser()
                            .then(async result => {
                                res.status(200).json({message:"Usuário atualizado com sucesso"})
                            })
                            .catch(err=>{
                                res.status(500).json({message:err})
                                return
                            })
                    } catch (err) {
                        res.status(500).json({message:err})
                        return
                    }
                    /* if(!id){
                        res.status(422).json({message: 'O id é obrigatório'})
                        return
                    } */
                    
                
            })
            .catch(err => {
                res.json({"message":err})
            })
                })
                .catch(err => {
                    //res.json({"message":err})
                    return new Error(err)
                })
        }
            userConsult()
            .then()
            .catch(err =>{
                console.log(err)
            })
    }
    }
}
