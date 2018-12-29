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
            orderOfFunction: []
        };

        
        const codes = [] ;          
        codes.push(req.body.code);      
        if(req.body.code_compare)  codes.push(req.body.code_compare) ; 
    
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
                await resultMap.forEach((value, key) => {   resultMapArray.push([key, value]); });
                const fn = interpolating(resultMapArray);
                result.functions.push(fn);
                result.orderOfFunction.push(apiResult.results.replace(/\$\$/g,''));
            }
          if(codes.length > 1) return this.compare(res,result)  ;
          res.render('response.hbs' , {result:result.orderOfFunction});

        } catch (error) {
            
            console.log(`[Error in the calcute method in contoroller]`);
        }
        
    }



    compare(res,result){
            console.log('[in the compare method]');
          //  console.log(result.functions[0]) ;
            let compare_result = '' ;
            console.log(result.functions[0](config.testRange.infiniteNumber)) ;     
            console.log(result.functions[1](config.testRange.infiniteNumber)) ;


           if(result.functions[0](config.testRange.infiniteNumber) > result.functions[1](config.testRange.infiniteNumber)){

              compare_result = `right function is <stronge> faster </stronge> than left function <br> `;

           }else if(result.functions[0](config.testRange.infiniteNumber) < result.functions[1](config.testRange.infiniteNumber)){

              compare_result = ` left function is <stronge> faster </stronge> than right function <br> `;

           }else{

              compare_result = `complexity of left function is  <stronge> equal </stronge> to right one <br> `;     
           }     

            return res.render('response' , {result : compare_result});    
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
                            resolve(result.data);
                        });
                    });
                return apiResult ;    
      }
    
    

}


module.exports = new Controller();