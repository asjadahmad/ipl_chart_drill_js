const express=require('express');
const app=express();
const path=require('path')
const port=process.env.PORT || 9000
app.use(express.static(path.join(__dirname,'..','/public')))


app.get("/output/:filename", (req, res) => {
    console.log(req.url)
    const filename = path.join(__dirname,"..",'public',req.url);
    res.sendFile(filename)
  });
  

  app.get("./:filename"  , (req,res)=>{
    const filename = path.join(__dirname,"..",'public',req.url);
    res.sendFile(filename)
  })

app.listen(port , ()=>{
    console.log("server listening to 9000");
})