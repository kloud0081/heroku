const mongoose=require("mongoose")
const productshema=new mongoose.Schema({
    imagepath:{type:String},
    productname:{type:String},
    information:{type:{storageOpaciity:Number,numberOfSim:String,cameraResolution:Number,displaysize:Number}},
    price:{type:Number},
})
module.exports=mongoose.model("product",productshema)

