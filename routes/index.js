
const Product = require("../models/Product")
var express = require('express');
var router = express.Router();
const Cart = require("../models/Cart")
const Order = require("../models/Order")

const  Publishable_Key= 'pk_test_51JHtHxCg0cGy17uACi6egStiBLMRjtZBPKnufaeYDrGPCJOrRZmL56HXto6rOi3J9IlAY54H4VO1T9Ot66bd0PQU00rlMCKIYs'
var Secret_Key = "sk_test_51JHtHxCg0cGy17uA2J2LJAkJV1t0269RzTHTrmoYcenKf98TswHdp4GVnNx92kcKYSSf39kNbu4MwGgA97XFYoLD00Ew7HUTjC"
    // Add your Secret Key Here

    const stripe = require('stripe')(Secret_Key) 


/* GET home page. */

const colum = []
console.log(__dirname)


router.get('/', function (req, res) {

   var totalquantity=0
   if(req.isAuthenticated()){
      if (req.user.cart)
    {      totalquantity=req.user.cart.totalquantity} else
 totalquantity=0
}
   Product.find({}, (error, doc) => {
      if (error) { console.log(error) }
      const columgrid = 3
      for (let i = 0; i < doc.length; i = i + columgrid) {
         colum.push(doc.slice(i, i + columgrid))
         //  console.log(colum)
      }
   })
   res.render("index", { title: "Shopping", product: colum, check: req.isAuthenticated(),totalquantity:totalquantity });
});
router.get("/addtocart/:id/:price/:name", (req, res, next) => {
   const cartId = req.user._id
   const newpriceproduct = parseInt(req.params.price, 10)
   const newProduct = {
      _id: req.params.id,
      name: req.params.name,
      price: newpriceproduct,
      quantityproduct:1,
      createdAt:Date.now(),
   }
   Cart.findById(cartId, (err, cart) => {
      if (err) { console.log(err) };
      if (!cart) {
         const newcart = new Cart({ _id: cartId, totalquantity: 1, totalprice: req.params.price, selectedProduct: [newProduct] })
         newcart.save((err, doc) => {
            if (err)
               console.log(err)
            else console.log(doc)
         })
      }
      if (cart) {
         var indexofproduct = -1;
         for (var i = 0; i < cart.selectedProduct.length; i++) {
            
            if (req.params.id === cart.selectedProduct[i]._id)
             {  indexofproduct = i; break;
}
                                                             };
         if (indexofproduct >= 0) {    
            cart.createdAt=Date.now();
    cart.selectedProduct[indexofproduct].quantityproduct =cart.selectedProduct[indexofproduct].quantityproduct +1 ; 
    cart.selectedProduct[indexofproduct].price=cart.selectedProduct[indexofproduct].price+newpriceproduct;
    cart.totalquantity=cart.totalquantity+1
    cart.totalprice=cart.totalprice+newpriceproduct;
    Cart.updateOne({ _id: cartId }, { $set: cart }, (err, doc) => {
      if (err) { console.log(err); }
      // console.log(doc)
       console.log(cart)
   })
   }
         else {
            cart.createdAt=Date.now();
            cart.totalquantity = cart.totalquantity + 1; cart.totalprice = cart.totalprice + newpriceproduct; cart.selectedProduct.push(newProduct)
            Cart.updateOne({ _id: cartId }, { $set: cart }, (err, doc) => {
               if (err) { console.log(err); }
               // console.log(doc)
                console.log(cart)
            })
         }
      }
   })
      res.redirect("/")
   })
router.get("/shoppingcart",(req,res)=>{
   if(!req.isAuthenticated()){res.redirect("/users/login");return} 
         if (!req.user.cart){
            res.render("shopping-cart",{check:true, totalquantity:0,})

         return
      };
         const usercart=req.user.cart
   res.render("shopping-cart",{usercart:usercart,check:true, totalquantity:req.user.cart.totalquantity
   })
})
router.get("/increaseproduct/:index",(req,res)=>{
   const usercart=req.user.cart;
   const index=req.params.index;
   const productprice=req.user.cart.selectedProduct[index].price/req.user.cart.selectedProduct[index].quantityproduct
   
   req.user.cart.selectedProduct[index].quantityproduct =    req.user.cart.selectedProduct[index].quantityproduct +1
    req.user.cart.totalquantity=req.user.cart.totalquantity+1
    req.user.cart.selectedProduct[index].price =    req.user.cart.selectedProduct[index].price +productprice
   req.user.cart.totalprice =req.user.cart.totalprice+ productprice;
   re.user.cart.createdAt=Date.now();

   Cart.updateOne({ _id: req.user.cart._id }, { $set: req.user.cart }, (err, doc) => {
      if (err) { console.log(err); }
      console.log(doc)
   })
   res.redirect("/shoppingcart")
})
router.get("/decreaseproduct/:index",(req,res)=>{
   const usercart=req.user.cart;
   const index=req.params.index;
   const productprice=req.user.cart.selectedProduct[index].price/req.user.cart.selectedProduct[index].quantityproduct
   req.user.cart.selectedProduct[index].quantityproduct =    req.user.cart.selectedProduct[index].quantityproduct -1
    req.user.cart.totalquantity=req.user.cart.totalquantity-1
    req.user.cart.selectedProduct[index].price =    req.user.cart.selectedProduct[index].price -productprice
   req.user.cart.totalprice =req.user.cart.totalprice- productprice;
   req.user.cart.createdAt=Date.now();

   Cart.updateOne({ _id: req.user.cart._id }, { $set: req.user.cart }, (err, doc) => {
      if (err) { console.log(err); }
      console.log(doc)
   })
   res.redirect("/shoppingcart");
})

router.get("/deleteproduct/:index",(req,res)=>{
   const usercart=req.user.cart;
   const index=req.params.index;
if(req.user.cart.selectedProduct.length<=1){ 
       Cart.deleteOne({_id:req.user.cart._id},(err,doc)=>{
          if (err) 
       console.log(err)
          else 
          console.log(doc)
          res.redirect("/shoppingcart")

       })} 
      
   else 
   { 
   req.user.cart.totalquantity=req.user.cart.totalquantity-1
   req.user.cart.totalprice =req.user.cart.totalprice-req.user.cart.selectedProduct[index].price ;
   req.user.cart.selectedProduct.splice(index,1)
   req.user.cart.createdAt=Date.now();
   Cart.updateOne({ _id: req.user.cart._id }, { $set: req.user.cart }, (err, doc) => {
      if (err) { console.log(err); }
      console.log(doc)
   })
   res.redirect("/shoppingcart")
      }
})

router.get('/checkout', function(req, res){ 
   if(req.user.cart){
      res.render('checkout', { 
         key: Publishable_Key ,totalquantity:req.user.cart.totalquantity,check:true,totalprice:req.user.cart.totalprice*100
      
         }) 
   }
   else    res.redirect("/shoppingcart")
 
}) 
 //4242 4242 4242 4242
//09/2024
//268

router.post('/payment', function(req, res){ 

   // Moreover you can take more details from user 
   // like Address, Name, etc from form 
   stripe.customers.create({ 
       email: req.body.stripeEmail, 
       source: req.body.stripeToken, 
       name: 'Gautam Sharma', 
       address: { 
           line1: 'TC 9/4 Old MES colony', 
           postal_code: '110092', 
           city: 'New Delhi', 
           state: 'Delhi', 
           country: 'India', 
       } 
   }) 
   .then((customer) => { 

       return stripe.charges.create({ 
           amount: req.user.cart.totalprice,   
           description: 'Web Development Product', 
           currency: 'USD', 
           customer: customer.id 
       }); 
   }) 
   .then((charge) => {

      // console.log(charge)
      modelorder=new Order({
          user:req.user._id,
          cart:req.user.cart,
          name:req.body.name,
          email:req.body.email,
 adress:req.body.address,
          paymentid:charge.id,
          orderprice:req.user.cart.totalprice,
       }) 
       modelorder.save((err,result)=>{
          if (err)
 {         console.log(err)}    
 console.log(result)
 Cart.deleteOne({_id:req.user.cart._id},(err,doc)=>{
   if (err)
{          console.log(err)} console.log(doc);
res.redirect("/") // If no error occurs 

})
   })
   }) 
   .catch((err) => { 
      req.flash("errorcart",err)
       res.send(err)    // If some error occurs 
   }); 
}) 
   module.exports = router;