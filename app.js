const express = require('express');
const app     = express();
const config  = require('./config/mainConfig');
const hbs     = require('hbs');
const path    = require('path');
const bodyParser = require('body-parser'); 
const Compiler = require('./controllers/JSCompiler');
const Api      = require('./controllers/Api');


app.use(express.static(path.join(__dirname,'public')));
app.set('view engine' , 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true})) ;

app.get('/' , (req ,res ) => {
    res.render('home.hbs');
});



app.post('/calcute' , Compiler.saveCode , Api.calcute);

















app.get('/compare' , (req ,res) => {

        // code 

});


app.listen(config.port ,(err) => {

    if(!err){
        console.log(`app run on server ${config.port}`);
    }    
})

