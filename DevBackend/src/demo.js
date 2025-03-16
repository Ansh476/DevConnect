const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.get('/ab?c', (req, res) => {
    res.send('b is optional here');
});
app.get('/a(bc)?d', (req, res) => {
    res.send('bc is optional here');
});
app.get('/ab+c', (req, res) => {
    res.send('b can be any number of times in b/w a and c!');
});
app.get('/ab*cd', (req, res) => { 
    res.send('anything can be written after b followed by cd like abanshcd ');
});

// app.get(/a/, (req, res) => { //regex
//     res.send('works wherever "a" is present!');
// });
app.get(/.*fly$/, (req, res) => { //regex
    res.send('works wherever "fly" is present eg butterfly ,jetfly, flyhigh!');
});

app.get('/about', (req, res) => {
    console.log(req.query)
    res.send('This is the About page');
});
app.get('/user/:userId', (req, res) => {
    console.log(req.params)
    res.send('This is the About page');
});

app.listen(7777, () => {
    console.log('Server is running at port 7777');
});

app.use((error, req, res, next) => {
    if (res.headersSent) {
      return next(error);
    }
    res.status(error.status || 500);
    res.json({ message: error.message || 'An unknown error occurred!' });
  });

  app.get('/user',async (req,res)=>{
    try{
        const users = await User.find({});
        res.send(users);
    }
    catch(err){
        res,status(404).send("User not found");
    }
})
app.get('/email',async (req,res)=>{
    const emailId = req.body.emailId;
    try{
        const user = await User.findOne({emailId});
        res.send(user);
    }
    catch(err){
        res,status(404).send("User not found");
    }
})
app.delete('/user/:userId',async (req,res)=>{
    const {userId} = req.params;
    try{
        const user = await User.findByIdAndDelete(userId);
        res.send("user deleted");
    }
    catch(err){
        res,status(404).send("User not found");
    }
})
app.patch('/user/:userId',async (req,res)=>{
    const {userId} = req.params;
    const data = req.body;
    try{
        //api level data sanitization
        const allowed_updates = ["firstName", "lastName", "age","gender","emailId"]
        const isUpdateallowed = Object.keys(data).every((key)=>allowed_updates.includes(key)
        );
        if(!isUpdateallowed){
            throw new Error("update not allowed");
        }
        if(data.skills && data?.skills.length >10){
            throw new Error("Skills cannot be more than 10");
        }
        const user = await User.findByIdAndUpdate(userId,data,{returnDocument:"after",runValidators:true});
        res.send("user updated");
    }
    catch(err){
        res.status(404).send("error occured : "+ err.message);
    }
})