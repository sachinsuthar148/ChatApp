const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const Chat = require("./models/chat");
const methodOverride = require("method-override");
const ExpressError = require("./ExpressError");


async function main() {
    mongoose.connect("mongodb://127.0.0.1:27017/whatsapp");
  }
  main()
    .then(() => {
      console.log("server is connected");
    })
    .catch((err) => {
      console.log(err);
    });


app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");

app.use(express.static(path.join(__dirname,"public")))

app.use(express.urlencoded({extended:true}))

app.use(methodOverride("_method"));

app.get("/",async (req,res)=>{
    res.send("root route is working");
});

app.get("/chats",async (req,res)=>{
    let Allchat=await Chat.find();
    res.render("index.ejs",{Allchat});
});

app.get("/chats/new",(req,res)=>{
    res.render("newChat.ejs");
})




// FOUR METHOD TO HANDLE THE ERRORS =>
// 1. NORMAL ERROR
// 2. ASYNC ->  EXPRESS ERROR AND NEXT KEYWORD
// 3. TRY CATCH (BULKY)
// 4. WRAPASYNC FUNCTION -> WRAP THE CALL BACK

app.post("/chats", wrapAsync((req,res)=>{
    let { from,to,message}= req.body;
    let newChat = new Chat({
        from:from,
        to:to,
        message:message,
        created_at:new Date()
    })    
    newChat.save(newChat)
    .then((res)=>{console.log(res);})
    .catch((err)=>{console.log(err);})
    res.redirect("/chats");
}));    


const handleValidationErr= (err)=>{
    console.log("validation error please follow the guidelines");
    console.dir(err.message);
    return err;
}


app.use((err,req,res,next)=>{
    console.log(err.name);
    if(err.name === "ValidationError"){
        err=handleValidationErr(err);
    }
    next(err);
});


app.get("/chats/:id/edit",wrapAsync(async (req,res,next)=>{
    let {id}=req.params;
    let chat= await Chat.findById(id);
    // if(!chat){
        // return next(new ExpressError(404,"Chat Not Found"));
        // }    
        res.render("edit.ejs",{chat});
    }));    
    
    app.put("/chats/:id", wrapAsync(async (req,res)=>{
        let {id}= req.params;
        let {message: newMsg}=req.body;
        let updatedChat = await Chat.findByIdAndUpdate(id,{message:newMsg},{new:true,runValidators:true});
        console.log(updatedChat);
        res.redirect("/chats");
    }));    
    
    app.delete("/chats/:id",wrapAsync(async (req,res)=>{
        let {id}=req.params;
        let deleltedChat = await Chat.findByIdAndDelete(id);
        console.log(deleltedChat);
        res.redirect("/chats");
        
    }));    
    
    
    
    app.use((err,req,res,next)=>{
        let {status=500,message="Page not Found"}=err;
        res.status(status).send(message);
    })
    
    function wrapAsync(fn){
        return function (req,res,next){
            fn(req,res,next).catch((err)=>next(err));
        }
    }
    
    app.listen(8080, ()=>{
        console.log("server is listening on port 8080");
    });
    
