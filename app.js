import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { v2 as cloudinary } from 'cloudinary';

import dotenv from 'dotenv';
dotenv.config();

import db from './config/mongoose-connection.js';


import userRouter from './routes/userRouter.js';
import productRouter from './routes/productRouter.js';
import indexRouter from './routes/indexRouter.js';
import cookieParser from 'cookie-parser';
import expressSession from 'express-session';
import flash from 'connect-flash';


const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.set('view engine', 'ejs')
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,'public')));
app.use(cookieParser());


app.use(
    expressSession({
        resave: false,
        saveUninitialized: false,
        secret: process.env.JWT_KEY,
    })
);
app.use(flash());



app.use("/", indexRouter);
app.use("/user", userRouter)
app.use("/product", productRouter);



// const port = 3001;
// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });

app.listen(3001);
