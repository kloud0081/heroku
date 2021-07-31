var express = require("express");
var router = express.Router();
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const order = require("../models/Order");

const passport = require("passport");
var csrf = require('csurf')
 
// setup route middlewares
var csrfProtection = csrf({ cookie: true })
router.get("/signup",csrfProtection,isnotLogin, function (req, res, next) {
  const message = req.flash("errorsignup");
  res.render("user/signup", { title: "Sign up", erromsg: message , csrfToken: req.csrfToken() })})
router.post(
  "/signup",
  body("email").not().isEmpty(),
  body("password").not().isEmpty(),
  body("password").isLength({ min: 5 }),
  body("confirm").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Password confirmation does not match password");
    }
    return true;
  }),
  (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      var validmessage = [];
      for (let i = 0; i < error.errors.length; i++) {
        validmessage.push(error.errors[i].msg);
      }
      req.flash("errorsignup", validmessage);res.redirect("signup");
      return;
    }next();}
    ,  passport.authenticate("local-signup", {
       session: false,
         successRedirect: "/",
         failureRedirect: "signup",
         failureFlash: true,
       }))
router.get("/login",csrfProtection,isnotLogin, function (req, res) {
  var messageerror = req.flash("errorlogin");
  res.render("user/login",{ title: "Login", massag: messageerror , csrfToken: req.csrfToken()});
});
router.get("/profile", isLogin, (req, res) => {
  if (req.user.cart)
    totalquantity=req.user.cart.totalquantity;
    else 
    totalquantity=0;
    order.find({user:req.user._id},(err,order)=>{
      if (err)
{      console.log(err)
}      console.log(order)
res.render("user/profile", {
  title: "profile",
  check: true,
  checkprofile: true,
  totalquantity:totalquantity,
  orderuser:order
});
    })

  
 
});
router.post(
  "/login",
  passport.authenticate("local-login", {
    successRedirect: "profile",
    failureRedirect: "login",
    failureFlash: true,
  })
);
router.get("/logout", isLogin, (req, res) => {
  req.logOut();
  res.redirect("/");
});
function isLogin(req, res, next) {
  if (!req.isAuthenticated()) {
    res.redirect("login");
    return;
  }
  next();
}
function isnotLogin(req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect("/");
    return;
  }
  next();
}
module.exports = router;
