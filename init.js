const mongoose = require("mongoose");
const Chat = require("./models/chat");

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

let chats = [
  {
    from: "Sachin",
    to: "greet1",
    message: "this is greeting 1 from sachin ",
    created_at: new Date(),
  },
  
  {
    from: "Sachin",
    to: "greet2",
    message: "this is greeting 2 from sachin ",
    created_at: new Date(),
  },
  
  {
    from: "Sachin",
    to: "greet3",
    message: "this is greeting 3 from sachin ",
    created_at: new Date(),
  },
  
];

Chat.insertMany(chats);
