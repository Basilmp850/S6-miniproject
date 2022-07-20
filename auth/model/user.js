const mongoose= require('mongoose');

const schema = mongoose.Schema;

const user= new schema({
    email: {
    type: String,
    required: true},

    password:{
        type:String,
        required: true
    },
    inside:{
        topic: [{topicid:{type: schema.Types.ObjectId, ref:'selecteddata', required:true}}]
    }

});

module.exports= mongoose.model('user',user);