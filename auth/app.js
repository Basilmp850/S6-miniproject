const express = require('express');

const app= express();

const MURI= 'mongodb+srv://roshan:roshan@searchbook.9bw1f7a.mongodb.net/auth';

const bp= require('body-parser');

const bcrypt= require('bcryptjs')

const mongoose = require('mongoose'); 

const session = require('express-session');

const User= require('./model/user');

const mongostore= require('connect-mongodb-session')(session);

const store =new mongostore({
    uri: MURI,
    collection: 'sessions'
});

app.use(express.json());

app.set('view engine','ejs');

app.use(bp.urlencoded({extended:false}));



app.use(
    session({secret: 'my secret', resave: false, saveUninitialized:false,store:store})
);

app.get('/signin',(req,res)=>{
    
     res.render('signin');

});

app.post('/signin',(req,res)=>{
    const email = req.body.email;
    const password = req.body.psw;
    User.findOne({ email: email })
      .then(user => {
        if (!user) {
          return res.redirect('/signin');
        }
        bcrypt
          .compare(password, user.password)
          .then(doMatch => {
            if (doMatch) {
              req.session.isLoggedIn = true;
              req.session.user = user;
              return req.session.save(err => {
                console.log(err);
                res.render('limited');
              });
            }
            res.redirect('/signin');
          })
          .catch(err => {
            console.log(err);
            res.redirect('/signin');
          });
      })
      .catch(err => console.log(err));
});


app.get('/signup',(req,res)=>{
    res.render('signup');
});


app.post('/signup',(req,res)=>{
   const email= req.body.email;
   const pass= req.body.psw;
   User.findOne({email:email})
   .then((doc)=>{
    if(doc){
        return res.redirect('/signup');
    }
    return bcrypt.hash(pass,12)
    .then(hashed=>{
        const user= new User({
            email:email,
            password:hashed,
            inside: {topic: [] }
        });
        return user.save();
    })
    .then(result=>{
        res.redirect('/signin');
    });
   
   }).catch((err)=>{
    cosole.log(err);
   });
});


app.post('/signout',(req,res)=>{
    req.session.destroy((err)=>{


        res.redirect('/');
        
    });
    console.log('post');
    
   });


app.use('/',(req,res)=>{
    res.render('index');
 });



 mongoose.connect(MURI)
.then(()=>{
   
   app.listen(3000);
   console.log("Mongodb live");})
.catch(result=>{console.log('error');});


