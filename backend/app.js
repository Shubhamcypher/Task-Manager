const express = require("express");
const app = express();
const cors = require("cors")
const allowedOrigins = [
    'https://task-manager-frontend-azure.vercel.app',
    'http://localhost:3000'
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true
}));

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