const chalk = require("chalk");

const nota = 5;

if(nota>=7){   
    console.log(chalk.green("Parabéns, vc está aprovado"));
} else{
    console.log(chalk.bgRed.black("voce precia de recuperação"));
}