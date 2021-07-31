const mongoose=require("mongoose")
const Product=require("../models/Product")
mongoose.connect("mongodb://localhost/od",{useNewUrlParser:true},(error)=>{
  if (error)
  console.log(error)
  else console.log("connected to db")
})
const arr=[
{imagepath:"/images/u.jpg" ,
productname:"huwawei y10",
information:{torageOpaciity:64,numberOfSim:"dual sim",cameraResolution:12,displaysize:5},
price:220},
{imagepath:"/images/o.jpg" ,
productname:"huwawei y8",
information:{torageOpaciity:32,numberOfSim:"dual sim",cameraResolution:10,displaysize:5},
price:150},
{imagepath:"/images/p.jpg" ,
productname:"samsung y9",
information:{torageOpaciity:64,numberOfSim:"dual sim",cameraResolution:12,displaysize:5},
price:220},
{imagepath:"/images/i.jpg" ,
productname:"nokia y9",
information:{torageOpaciity:64,numberOfSim:"dual sim",cameraResolution:12,displaysize:5},
price:220},
];
console.log(arr.length)
Product.create(arr,(err,data)=>{
   if (err)
{   console.log(err)}        
        else
         console.log(data)
        // mongoose.disconnect()
})

