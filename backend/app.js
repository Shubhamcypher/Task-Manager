const express = require("express");
const app = express();
const cors = require("cors")
app.use(cors())

const userAPI = require("./routes/user.route.js")
const taskAPI = require("./routes/task.route.js")

require("dotenv").config()
require("./connection/connection")
app.use(express.json())
app.use("/api/v1",userAPI)
app.use("/api/v2",taskAPI)

app.use("/", (req,res)=>{
    res.send("Hello from backend brother")
})


app.listen(`${process.env.PORT}` , ()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
})