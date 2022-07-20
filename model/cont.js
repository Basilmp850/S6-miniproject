const mongoose= require('mongoose');

const schema = mongoose.Schema;

const con= new schema({
    topic: String,
    selected: Boolean,
    content: [{data:String,
               url: String,
               date: Date 
    }],
    // userid:{
    //     type: schema.Types.ObjectId,
    //     ref:'user',
    //     required: true
    // }
    
});

module.exports= mongoose.model('selecteddata',con);