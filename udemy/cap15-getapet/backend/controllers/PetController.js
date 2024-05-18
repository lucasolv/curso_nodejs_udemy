const pool = require('../db/conn')
//const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

//helpers
const getToken = require("../helpers/get-token")

module.exports = class PetController{

    //create a pet
    static async create(req,res){
        const {id,name,age,weight,color} = req.body

        const images = req.files

        const available = true

        let dataAtual = new Date()

        function pad(num, size) {
            let s = num + "";
            while (s.length < size) s = "0" + s;
            return s;
          }
        const createdAt = `${dataAtual.getFullYear()}-${pad(dataAtual.getMonth() + 1, 2)}-${pad(dataAtual.getDate(), 2)}T${pad(dataAtual.getHours()+3, 2)}:${pad(dataAtual.getMinutes(), 2)}:${pad(dataAtual.getSeconds(), 2)}.${pad(dataAtual.getMilliseconds(), 3)}Z`
        //console.log(createdAt)

        //images upload

        //validation
        if(!name){
            res.status(422).json({message: 'O nome é obrigatório'})
            return
        }
        if(!id){
            res.status(422).json({message: 'O id é obrigatório'})
            return
        }
        if(!age){
            res.status(422).json({message: 'A idade é obrigatória'})
            return
        }
        if(!weight){
            res.status(422).json({message: 'O peso é obrigatório'})
            return
        }
        if(!color){
            res.status(422).json({message: 'A cor é obrigatória'})
            return
        }
        if(images.length === 0){
            res.status(422).json({message: 'A imagem é obrigatória'})
            return
        }

        //get pet owner
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
                    const textUser = JSON.stringify(user)


                    //create a pet
                    const pet = {
                        id: id,
                        name: name,
                        age: age,
                        weight: weight,
                        color: color,
                        available: true,
                        images: [],
                        user: user,
                        createdAt: createdAt
                    }

                    images.map((image)=>{
                        pet.images.push(image.filename)
                    })

                    try {
                        //salvar o pet no banco
                        const petSave = function() {
                            const sql = `INSERT INTO pets (id,name,age,weight,color,available,images,user,createdAt) VALUES (?,?,?,?,?,?,?,?,?);`;
                            const data = [id,name,age,weight,color,available,JSON.stringify(pet.images),textUser,createdAt];
                            return new Promise((resolve, reject) => {
                                pool.query(sql, data, function(err, result) {
                                    if (err) {
                                        //res.status(500).json({"message":err})
                                        reject(err);
                                    } else {
                                        //console.log(result);
                                        resolve(result);
                                    }
                                });
                            });
                        };
                        petSave()
                        .then(async result=>{
                            //console.log("oie")
                            res.status(201).json({message:"Pet cadastrado com sucesso",
                                pet
                            })
                        })
                        .catch(err=>{
                            res.status(500).json({"message":err})
                        })






                    } catch (err) {
                        res.status(500).json({message:err})
                    }

                })
                .catch(err => {
                    res.status(500).json({message:err})
                })
        }
            userConsult()
            .then()
            .catch(err =>{
                res.status(500).json({message:err})
            })
        }
        
    }

    static async getAll(req,res){
        const getAllPets = function() {
            const sql = `SELECT * FROM pets;`;
            
            return new Promise((resolve, reject) => {
                pool.query(sql, function(err, result) {
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
        getAllPets()
            .then(async result=>{
                res.status(200).json(result.sort((a, b) => b.id - a.id))
            })
            .catch(err=>{
                res.status(500).json({message:err})
            })
    }

    static async getAllUserPets(req,res){
        
        //get user from token
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
                    const textUser = JSON.stringify(user)

                    const getPetsByUser = function() {
                        const sql = `SELECT * FROM pets WHERE user = ?;`;
                        const data = [textUser]
                        
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
                    getPetsByUser()
                        .then(async result=>{
                            const resultPets = result
                            res.status(200).json({resultPets})
                        })
                        .catch(err=>{
                            res.status(500).json({message:err})
                        })
                    
                })
                .catch(err => {
                    res.status(500).json({message:err})
                })
        }
            userConsult()
            .then()
            .catch(err =>{
                res.status(500).json({message:err})
            })
        }
    }

    static async getAllUserAdoptions(req,res){
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
                    const textUser = JSON.stringify(user)

                    const getPetsByUser = function() {
                        const sql = `SELECT * FROM pets WHERE adopter = ?;`;
                        const data = [textUser]
                        
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
                    getPetsByUser()
                        .then(async result=>{
                            const resultPets = result
                            res.status(200).json({resultPets})
                        })
                        .catch(err=>{
                            res.status(500).json({message:err})
                        })
                    
                })
                .catch(err => {
                    res.status(500).json({message:err})
                })
        }
            userConsult()
            .then()
            .catch(err =>{
                res.status(500).json({message:err})
            })
        }
    }

    static async getPetById(req,res){
        const id = req.params.id
        //check if id is valid
        if(isNaN(id)){
            res.status(422).json({message: 'ID inválido!'})
            return
        }

        const petById = function() {
            const sql = `SELECT * FROM pets WHERE id = ?;`;
            const data = [id]
            
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
        petById()
            .then(async result=>{
                if(!result[0]){
                    res.status(404).json({message: "Pet não encontrado!"})
                    return
                }
                res.status(200).json({pet: result[0]})
            })
            .catch(err=>{
                res.status(500).json({message:err})
            })

    }

    static async removePetById(req,res){
        const id = req.params.id

        //check if id is valid
        if(isNaN(id)){
            res.status(422).json({message: 'ID inválido!'})
            return
        }

        const petById = function() {
            const sql = `SELECT * FROM pets WHERE id = ?;`;
            const data = [id]
            
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
        petById()
            .then(async result=>{
                if(!result[0]){
                    res.status(404).json({message: "Pet não encontrado!"})
                    return
                }
                const resulPet = result[0]

                //check if logged in user registered the pet
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
                    const textUser = JSON.stringify(user)

                    if(resulPet.user !== textUser){
                        res.status(422).json({message:'Houve um problema em processar a sua solicitação, tente novamente mais tarde!'})
                        return
                    }
                    const removePet = function() {
                        const sql = `DELETE FROM pets WHERE id = ?;`;
                        const data = [id]
                        
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
                    removePet()
                        .then(async result=>{
                            res.status(200).json({message:"Pet removido com sucesso!"})
                        })
                        .catch(err=>{
                            res.status(500).json({message:err})
                        })
                })
                .catch(err => {
                    res.status(500).json({message:err})
                })
        }
            userConsult()
            .then()
            .catch(err =>{
                res.status(500).json({message:err})
            })
        }
                
            })
            .catch(err=>{
                res.status(500).json({message:err})
            })

    }

    static async updatePet(req,res){
        const id = req.params.id

        const {name,age,weight,color,available} = req.body

        const images = req.files

        const updatedData = {}

        //check if pet exists
        const petById = function() {
            const sql = `SELECT * FROM pets WHERE id = ?;`;
            const data = [id]
            
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
        petById()
            .then(async result=>{
                if(!result[0]){
                    res.status(404).json({message: 'Pet não encontrado'})
                    return
                }
                const resulPet = result[0]

                //check if logged in user registered the pet
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
                    const textUser = JSON.stringify(user)

                    if(resulPet.user !== textUser){
                        res.status(422).json({message:'Houve um problema em processar a sua solicitação, tente novamente mais tarde!'})
                        return
                    }
                    //validation
        if(!name){
            res.status(422).json({message: 'O nome é obrigatório'})
            return
        }
        updatedData.name = name
        /* 
        if(!id){
            res.status(422).json({message: 'O id é obrigatório'})
            return
        } */
        if(!age){
            res.status(422).json({message: 'A idade é obrigatória'})
            return
        }
        updatedData.age = age
        if(!weight){
            res.status(422).json({message: 'O peso é obrigatório'})
            return
        }
        updatedData.weight = weight
        if(!color){
            res.status(422).json({message: 'A cor é obrigatória'})
            return
        }
        updatedData.color = color
        if(images.length > 0){
            updatedData.images = []
        images.map(image=>{
            updatedData.images.push(image.filename)
        })
        } else{
            updatedData.images = JSON.parse(resulPet.images)
        }
        
        
        //update pet
        const updatePetById = function() {
            const sql = `UPDATE pets SET name = ?, age = ?, weight = ?, color = ?, images = ? WHERE id = ?;`;
            const data = [updatedData.name,updatedData.age,updatedData.weight,updatedData.color,JSON.stringify(updatedData.images),resulPet.id];
            
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
        updatePetById()
            .then(async result => {
                res.status(200).json({message:"Pet atualizado com sucesso"})
            })
            .catch(err=>{
                res.status(500).json({message:err})
                return
            })
                })
                .catch(err => {
                    res.status(500).json({message:err})
                })
        }
            userConsult()
            .then()
            .catch(err =>{
                res.status(500).json({message:err})
            })
        }
            })
            .catch(err => {
                res.status(500).json({message:err})
            })

    }

    static async schedule(req,res){
        const id = req.params.id

        //check if pet exists
        const petById = function() {
            const sql = `SELECT * FROM pets WHERE id = ?;`;
            const data = [id]
            
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
        petById()
            .then(async result=>{
                if(!result[0]){
                    res.status(404).json({message: 'Pet não encontrado'})
                    return
                }
                const resulPet = result[0]

                //check if user registered the pet
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
                    const textUser = JSON.stringify(user)

                    if(resulPet.user === textUser){
                        res.status(422).json({message:'Você não pode agendar uma visita com seu próprio pet!'})
                        return
                    }
                    //check if user has already scheduled a visit
                    if(resulPet.adopter){
                        if(resulPet.adopter === JSON.stringify(user)){
                            res.status(422).json({message:'Você já agendou uma visita para este pet!'})
                        return
                        }
                    }

                    //add user to pet
                    const updatePetById = function() {
                        const sql = `UPDATE pets SET adopter = ? WHERE id = ?;`;
                        const data = [JSON.stringify(user),resulPet.id];
                        
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
                    updatePetById()
                        .then(async result => {
                            res.status(200).json({message:`A visita foi agendada com sucesso! Entre em contato com ${JSON.parse(resulPet.user).name} pelo telefone ${JSON.parse(resulPet.user).phone}.`})
                        })
                        .catch(err=>{
                            res.status(500).json({message:err})
                            return
                        })
                })
                .catch(err => {
                    res.status(500).json({message:err})
                })
        }
            userConsult()
            .then()
            .catch(err =>{
                res.status(500).json({message:err})
            })
        }
            })
            .catch(err=>{
                res.status(500).json({message:err})
            })
    }

    static async concludeAdoption(req,res){
        const id = req.params.id

        //check if pet exists
        const petById = function() {
            const sql = `SELECT * FROM pets WHERE id = ?;`;
            const data = [id]
            
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
        petById()
            .then(async result=>{
                if(!result[0]){
                    res.status(404).json({message: 'Pet não encontrado'})
                    return
                }
                const resulPet = result[0]

                //check if user registered the pet
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
                    const textUser = JSON.stringify(user)

                    if(resulPet.user !== textUser){
                        res.status(422).json({message:'Houve um problema em processar a sua solicitação, tente novamente mais tarde!'})
                        return
                    }
                    resulPet.available = false
                    
                    const updatePetById = function() {
                        const sql = `UPDATE pets SET available = ? WHERE id = ?;`;
                        const data = [resulPet.available,resulPet.id];
                        
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
                    updatePetById()
                        .then(async result => {
                            res.status(200).json({message:"Parabéns! O ciclo de adoção foi finalizado com sucesso!"})
                        })
                        .catch(err=>{
                            res.status(500).json({message:err})
                            return
                        })
                })
                .catch(err => {
                    res.status(500).json({message:err})
                })
        }
            userConsult()
            .then()
            .catch(err =>{
                res.status(500).json({message:err})
            })
        }
            })
            .catch(err=>{
                res.status(500).json({message:err})
            })
    }
}