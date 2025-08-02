const express = require('express');
const helmet = require('helmet');
const app = express();
const cors = require('cors');
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const authRouter = require('./routers/authRouter');


app.use(cors());
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("Database connected successfully.");
}).catch(err=>{
    console.log(err);
});

app.use('/api/auth',authRouter);

app.get("/", (req, res)=>{
    res.json({message:"Hello from server!"});
});

app.listen(process.env.PORT,()=>{
    console.log("App listening on port", process.env.PORT);
})