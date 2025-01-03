import mongoose from 'mongoose';

// mongoose.set('strictQuery', true); // set it to false if needs to query the database by any field
const MONGO_URL = process.env.MONGO_URL || "mongodb+srv://abrar:1234@cluster0.cht5w.mongodb.net/ecom?retryWrites=true&w=majority";
const connection = mongoose.connect(MONGO_URL).then((response) => {
    console.log("MongoDB connected successfully-->");
})

