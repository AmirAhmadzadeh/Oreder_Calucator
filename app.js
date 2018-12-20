const express = require('express');

const app     = express();


const config  = require('./config/mainConfig');

const hbs     = require('hbs');

const path    = require('path');


const bodyParser = require('body-parser');


const Controller      = require('./controllers/Controller');
 

app.use(express.static(path.join(__dirname,'public')));


app.set('view engine' , 'hbs');


hbs.registerPartials(path.join(__dirname,'views/partials') ,(err) => {

    if(err) console.log(`[we have error in setting partials]`);
}) ;

app.use(bodyParser.json());


app.use(bodyParser.urlencoded({extended:true})) ;

app.get('/' , (req ,res ) => {  
    
    res.render('home.hbs');

});

app.post('/calcute' , Controller.calcute); 

app.get('/compare' , (req ,res) => {

        // code
        // in prugress
});

app.listen(config.port ,(err) => {

    if(!err){
        console.log(`app run on server ${config.port}`);
    }
})

