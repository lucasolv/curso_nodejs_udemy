const fs = require('fs');

if(!fs.existsSync('./minhapasta')){
    console.log('não existe');
    fs.mkdirSync('minhapasta');
}else if(fs.existsSync('./minhapasta')){
    console.log('existe');
}