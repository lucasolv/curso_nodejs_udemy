const inquirer = require("inquirer");
const chalk = require("chalk");

inquirer.prompt([
    {
        name: 'nome',
        message: 'Digite seu nome: '
    },
    {
        name: 'idade',
        message: 'Digite sua idade: '
    }
]).then((answers)=>{
    console.log(chalk.bgYellow.black(`Nome: ${answers.nome}, Idade: ${answers.idade}`));
}).catch(err=>{
    console.log(chalk.bgRed(err));
})