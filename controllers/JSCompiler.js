const fs = require('fs') ;
const path = require('path');
const exec =  require('child_process').exec ;
const autoBind = require('auto-bind');

class JsCompiler {

        constructor(){
            autoBind(this);
            this.codePath = './codes' ;
            this.fileName = `${Date.now()}.js`
        }

        saveCode(req ,res ,next){

            if(!fs.existsSync(this.codePath))  fs.mkdirSync(this.codePath) ;
            const code = req.body.code ;
            fs.writeFileSync(path.join(this.codePath, this.fileName), code);
            return next();
        }    


        run(){
               return new Promise((resolve,reject)=>{
                  exec(`node ${path.join(this.codePath,this.fileName)}`
                        , (err,stdout) => {
                            resolve(stdout);
                        }
                    );
               });  

        }
}


module.exports = new JsCompiler();