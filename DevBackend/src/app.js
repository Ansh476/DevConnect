const express = require('express');
const {connectDB}  = require('./config/database');
const app = express();
const User = require('./models/user');
const cookieparser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config(); 
const http = require('http');
const passport = require('passport');
require('./config/passport');

const port = process.env.PORT;


const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
const userRouter = require('./routes/user');
const initializesocket = require('./utils/socket');
const chatRouter = require('./routes/chat');
const googleRouter = require('./routes/googleAuth');

app.use(cors({
   origin: "http://localhost:5173", // Your frontend origin
   credentials: true,
   methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'], // Ensure PATCH is included
   allowedHeaders: ['Content-Type', 'Authorization'],
}));
 app.options('*', cors()); // Handle preflight requests for all routes


app.use(express.json());
app.use(cookieparser());

app.use("/",authRouter);
app.use(passport.initialize());
app.use("/", googleRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);
app.use("/",chatRouter);

const server = http.createServer(app);

initializesocket(server);

connectDB()
 .then(() => {
    console.log('MongoDB Connected...');
    server.listen(port, () => {
        console.log('Server is running at port 7777');
    });
 })
 .catch((error) => {
    console.log(error);
 });

app.use((error, req, res, next) => {
    if (res.headersSent) {
      return next(error);
    }
    res.status(error.status || 500);
    res.json({ message: error.message || 'An unknown error occurred!' });
  });

