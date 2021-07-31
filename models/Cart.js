const mongoose=require("mongoose")
    const cartshema=new mongoose.Schema({

    _id:{required:true,type:String},
    totalquantity:{require:true,type:Number},
    totalprice:{required:true,type:Number},
    selectedProduct:{required:true,type:Array},
    createdAt: { type: Date, index:{expires: '10080m'} }

})
module.exports=mongoose.model("cart",cartshema)
