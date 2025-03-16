const mongoose = require('mongoose');

const connectionrequestSchema = new mongoose.Schema({
    fromuserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true
    },
    touserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true
    },
    status:{
        type:String,
        enum:{
            values: ["ignored","interested","accepted","rejected"] ,
            message: `{VALUE} is not supported`
        }
    }
},
{
    timestamps:true,
}
);

connectionrequestSchema.index({fromuserId:1,touserId:1});

connectionrequestSchema.pre("save",function(next){
    // const Connrequest = this;
    if(this.fromuserId.equals(this.touserId)){
        throw new Error("cannot send connection request to yourself")
    }
    next();
})

const Connrequest = new mongoose.model('Connectionrequest',connectionrequestSchema)

module.exports = Connrequest;