const mongoose=require("mongoose")
const Schema = mongoose.Schema;
const ordershema=Schema({
    user: { type: Schema.Types.ObjectId, ref: 'person' },
    cart:{type:Object,required:true},
    name:{type:String,required:true},
    adress:{type:String,required:true},
    paymentid:{type:String,required:true},
    orderprice:{type:String,required:true},
})
module.exports=mongoose.model("order",ordershema)