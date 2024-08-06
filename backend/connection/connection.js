const mongoose = require("mongoose")

const connection = async()=>{
    try {
        const res = await mongoose.connect(`${process.env.MONGO_URI}`);

        if (res) {
            console.log("Connected to Database");
        }
    } 
    catch (error) {
        console.log(error);
    }
}

connection();