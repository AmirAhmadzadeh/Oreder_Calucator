
const exec = require('child_process').exec ;



exec(`node test1.js` , ( error,stdout,stderr) => {
     

        if(error) console.log( '[Error]', error) ;
        console.log(stdout.toString());
    
        ers = stdout.split('*');
        console.log(ers);
        console.log(stdout.split('*').length);


}) ;





