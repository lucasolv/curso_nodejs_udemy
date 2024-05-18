const jwt = require('jsonwebtoken')
const pool = require('../db/conn')
//nao estou utilizando

const getUserByToken = async (token)=>{
    if(!token){
        return res.status(401).json({message:'Acesso negado!'})
    }

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
            return result[0]

            //res.status(200).json({user})
        })
        .catch(err => {
            //res.json({"message":err})
            return new Error('Error')
        })
}

module.exports = getUserByToken