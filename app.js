const express = require('express');

const path =  require('path');

const app= express();

const bp= require('body-parser');
var phantomjs = require('phantomjs-prebuilt')


const mongoose = require('mongoose'); 

const con= require('./model/cont');

//pdf logic starts here

const pdf = require('pdf-creator-node');


const fs = require("fs");

const template = fs.readFileSync("./views/pdfhtml.ejs","utf-8");

const options = {

    format : "A4",
    orientation : 'portrait',
    border:"10mm"
};


//pdf logic ends here

app.use(express.static('public'));

app.use(express.json());

app.set('view engine','ejs');
// app.set('views', path.join(__dirname, 'views'));

app.use(bp.urlencoded({extended:false}));


// app.post('/gettopic',(req,res)=>{
//    const {parcel}= req.body;
//    console.log(parcel);
//    con.updateMany({},{"$set":{selected:false}})
//    .then(c=>{
//       con.findOneAndUpdate({topic: parcel},{selected: true})
//       .then(c=>{
//          con.find().then(c=>{
//             console.log('ethi');
//             res.render('mytopics',{alldata : c,success:'Topic selected'});
            
//           }
//           ).catch(err=>{
//              console.log(err);
//           });
//       })
//       .catch(err=>{
//          console.log(err);
//       });
      
//    })
//    .catch(err=>{
//       console.log(err);
//    });
   
  
// });



app.post('/save',(req,res,)=>{
   console.log(req.body);
   const c= new con({
      topic: req.body.topic,
      selected: false,
      content: []
   });
   c.save()
   .then(c=>{
       
        console.log(c);
        res.render('index',{success: "Data inserted!"});
  
     })
     .catch(err=>{
        console.log(err);
     });
});


app.get('/gettopic/:topic',(req,res)=>{
   
   
   const parcel= req.params.topic;
   console.log('parcel ',parcel);
   con.updateMany({},{"$set":{selected:false}})
   .then(c=>{
      con.findOneAndUpdate({topic: parcel},{selected: true})
      .then(c=>{
         
            console.log('ethi');
            res.render('successpage',{success:'Topic selected'});
            
        
      })
      .catch(err=>{
         console.log(err);
      });
      
   })
   .catch(err=>{
      console.log(err);
   });

});

app.get('/gettopic',(req,res)=>{

   con.find().then(c=>{
      console.log('ethii');
      res.render('mytopics',{alldata : c,success:''});
      
    }
    ).catch(err=>{
       console.log(err);
    });
   
 
});



//pdf logic goes here
app.get('/pdfmytopics',(req,res)=>{
  
   con.find().then(c=>{
      console.log('ethi');
      res.render('pdfmytopics',{alldata : c});
      
    }
    ).catch(err=>{
       console.log(err);
    });
   
 
});

//pdf logic ends here




// app.post('/gettopic',(req,res)=>{
  
//    const {parcel}= req.body;
   
//    console.log('post');
//    res.redirect('/xhowing?topic=' + parcel);
//    console.log( parcel+'parcel');
   
   
 
// });

app.get('/xhowing/:topic',(req,res)=>{

   const t= req.params.topic;
   // var passedVariable = req.query.topic;
   // console.log(passedVariable+'xhowing');
   // res.render('show',{passedVariable : passedVariable});
   con.findOne({topic: t})
   .then(c=>{
      console.log(c);
       res.render('show',{alldata : c});
   })
   .catch(err=>{
      console.log(err);
   });

});

app.get('/pdfhowing/:topic',(req,res)=>{

   const t= req.params.topic;
   // var passedVariable = req.query.topic;
   // console.log(passedVariable+'xhowing');
   // res.render('show',{passedVariable : passedVariable});
   con.findOne({topic: t}).lean()
   .then(c=>{
      
    
      let items = [];
      items.push(c);
      console.log(items[0].topic);
      console.log(items[0].content);
      let document = {
          html : template,
          data:{
              d : items,
              contentarray : items[0].content
          },
          path: "pdfhtmlq.pdf"
      };
      
      pdf.create(document,options)
      .then(() =>  {var data= fs.readFileSync('./pdfhtmlq.pdf');
      res.contentType("application/pdf");
      res.send(data);})
      .catch((err) => console.log(err));
      
      
   })
   .catch(err=>{
      console.log(err);
   });

});





app.use('/',(req,res)=>{
   res.render('index',{success: ''});
});

mongoose.connect('mongodb+srv://mongo:jonathan@cluster0.2uncw.mongodb.net/test2?retryWrites=true&w=majority')
// mongoose.connect('mongodb+srv://roshan:roshan@searchbook.9bw1f7a.mongodb.net/first?retryWrites=true&w=majority')
.then(()=>{
  
   app.listen(3000);
   console.log("Mongodb live");})
.catch(result=>{console.log('error');});