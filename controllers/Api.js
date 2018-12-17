const axios = require('axios');
const autoBind = require('auto-bind');


class Api {

    constructor(){
        autoBind(this);
    }

    calcute(req,res){
        res.render('response') ;   
    }
     
     

}


module.exports = new Api();