const axios = require('axios');

const autoBind = require('auto-bind');

const config   =require('../config/config');

const interpolating = require('interpolating-polynomial');

const child_process  = require('child_process');

const fs = require('fs') ;

const path = require('path');

const qs = require('qs');




class Controller {

    constructor(){
        autoBind(this);
        this.codePath = path.join(__dirname,'codes');
    }
  

    async calcute(req,res){
        
        const result = {
            functions: [],
            functionTexts: []
        };

        const codes = [] ;          
        codes.push(req.body.code);      

     
    
        try {
            
            for (let code of codes) {

                const resultMap = new Map();

                for (let i = config.testRange.from; i < config.testRange.to; i++) {

                    const modifiedCode = `const n = ${i};${code}`;

                    const result  = await this.runCode(modifiedCode) ;

                    resultMap.set(i, result.split('*').length);

                }

                const apiResult = await this.getInterpolating(resultMap);

                const resultMapArray = [];

                await resultMap.forEach((value, key) => {
               
                      resultMapArray.push([key, value])
                
                });

                const fn = interpolating(resultMapArray);

                result.functions.push(fn);

                result.functionTexts.push(apiResult.results.replace(/\$\$/g,''));

                console.log(result.functions);

                console.log(result.functionTexts);

                res.render('response.hbs' , {result:result.functionTexts});

        }

        } catch (error) {
            
            console.log(`[Error in the calcute method in contoroller]`);
        }
        
    }
     
    saveModifiedcode(code){

        if(!fs.existsSync(this.codePath))  fs.mkdirSync(this.codePath) ;
      
        const fileName  = `${Date.now()}.js`;
      
        fs.writeFileSync(path.join(this.codePath, fileName), code); 
      
        return fileName;    
    }

    runCode(code){

        const fileName = this.saveModifiedcode(code);
      
       
       const result = new Promise((resolve , reject) => {
            
                child_process.exec(`node ${path.join(this.codePath, fileName)} ` , (error ,stdout , stderr) => {
;
                     console.log(stdout.toString());  
                 
                     resolve(stdout) ;    
                 }) ;

        }) ;       

        return result ;
    
    
    }


    getInterpolating(map){
 
      const apiResult  = new Promise(async (resolve, reject) => {

            const data = [];
           
            await map.forEach((value, key) => {
        
                  data.push(`(${key},${value})`);
            });  
            axios.post(config.interpolating.url ,  qs.stringify({
                  tool: config.interpolating.tool ,
                  points: data.join('')  
                
                }), {
                 
                    'Content-Type': 'application/x-www-form-urlencoded'
                }).then(result => {
                 
                    // console.log(`[in axios]`);
                 
                    // console.log(result.data); 
                    resolve(result.data);
                });
            });
        
        console.log(`[In the interpolating function]`) ;
        return apiResult ;    
    }
   
    

}


module.exports = new Controller();