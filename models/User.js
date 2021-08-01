

 const bcrypt=require("bcrypt")

const mongoose=require("mongoose") 
const usershema=new mongoose.Schema({
    firstname:{type:String,required:true},
    lastname:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},

    
})

      usershema.methods.hashPassword=function (password){

      return bcrypt.hashSync(password,bcrypt.genSaltSync(5),null)}

      usershema.methods.comparePassword=function(password){
          return bcrypt.compareSync(password,this.password )
      }



module.exports=mongoose.model("person",usershema)