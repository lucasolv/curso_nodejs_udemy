const path = require('path');

console.log(path.resolve('arquivo.txt'));

const midFolder = 'relatorios';
const fileName = 'matheus.txt';

const finalPath = path.join('/','arquivos',midFolder,fileName);
console.log(finalPath);