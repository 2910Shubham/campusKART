import userModel from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import generateToken from '../utils/generateToken.js';

const registerUser = async function (req, res) {
  try {
    const { fullname, email, password, department, semester, roll_number } = req.body;

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      req.flash("error", "User already exists");
      return res.redirect("/"); 
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await userModel.create({
      fullname,
      email,
      password: hashedPassword, 
      department,
      semester,
      roll_number
    });

    req.flash("R_success", "Registration successful. Please login.");
    return res.redirect("/");


  } catch (error) {
    console.log(req.body);
    console.error("Error in registerUser:", error);

   req.flash("R_error", "Something went wrong. Please try again.");
    return res.redirect("/");
  }
};




const loginUser = async function (req,res) {
  let { email, password} = req.body;

  let user = await userModel.findOne({email});

  if(!user) {

    req.flash('error', 'No user found with this email');
    return res.redirect('/');
  } 

  bcrypt.compare(password,user.password, function(err, result){

    if(result){

     let token = generateToken(user);

          res.cookie("token", token);
          
          res.redirect('/home')

      
      
    } else {
      req.flash('error', 'Incorrect password');
      return res.redirect('/');
    }
  });


};

export{ registerUser, loginUser};
