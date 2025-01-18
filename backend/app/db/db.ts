import mongoose from 'mongoose';
import { adminSignupUser_func } from '../controllers/authControllers/functions/adminSignUp';
import { UserRole } from '../models/User';

// mongoose.set('strictQuery', true); // set it to false if needs to query the database by any field
const MONGO_URL = process.env.MONGO_URL || "mongodb+srv://abrar:1234@cluster0.cht5w.mongodb.net/ecom?retryWrites=true&w=majority";
const connection = mongoose.connect(MONGO_URL).then(async (response) => {
    console.log("MongoDB connected successfully-->");
    const userObj = {
        email: "admin@ecom.com",
        password: "12345678",
        firstName: "Admin",
        lastName: "Admin",
        role: UserRole.SUPER_ADMIN,
        mfaEnabled: false,
        mfaSecret: "",
    }
    const result =await adminSignupUser_func(userObj)
    if(result.success){
        console.log("Admin user created successfully")
    }else{
        console.log("Admin already exists")
    }
})

