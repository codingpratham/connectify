import express from 'express';
import cors from 'cors';
import router from './routes/auth.route';
import { prisma } from './lib/prisma';
import cookieParser from 'cookie-parser';


if(prisma){
    console.log("Prisma is connected");
}

const app =express()
app.use(express.static('avatars'))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin:['http://localhost:5173'],
    methods:['GET','POST','PUT','DELETE'],
    credentials:true,
}))
app.use("/api/auth",router)

app.listen(3000, () => {
    console.log('Server is running on port 3000');
    console.log('http://localhost:3000');
})