
const { GoogleGenerativeAI } = require("@google/generative-ai");
const mongoose      = require("mongoose");
const User          = require("../models/User");
const Chat          = require("../models/Chat");
const ChatMessage   = require("../models/ChatMessage");

const genAI  = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model  = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });


let conn = null;
async function db () {
  if (conn) return conn;
  conn = await mongoose.connect(process.env.MONGODB_URI);
  return conn;
}

const ALLOWED_METHODS = "GET,POST,OPTIONS";
const ALLOWED_HEADERS = "Content-Type";    

function setCors (res) {
  res.setHeader("Access-Control-Allow-Origin",  "*");     
  res.setHeader("Access-Control-Allow-Methods", ALLOWED_METHODS);
  res.setHeader("Access-Control-Allow-Headers", ALLOWED_HEADERS);
}

module.exports = async (req, res) => {
  setCors(res);

  
  if (req.method === "OPTIONS") {
    return res.status(204).end();          
  }

  await db();                              

 
  if (req.method === "GET") {
    const { email } = req.query;
    if (!email) return res.status(400).json({ detail: "email is required" });

    const user = await User.findOneAndUpdate(
      { email }, {}, { upsert: true, new: true }
    );
    const chat =
      (await Chat.findOne({ user })) || (await Chat.create({ user }));
    const messages = await ChatMessage.find({ chat })
                       .sort("created_at")
                       .lean();

    return res.json({ chatId: chat._id, email, messages });
  }

 
  if (req.method === "POST") {
    const { email, prompt } = req.body || {};
    if (!email || !prompt)
      return res.status(400).json({ detail: "email and prompt are required" });

    const user = await User.findOneAndUpdate(
      { email }, {}, { upsert: true, new: true }
    );
    const chat =
      (await Chat.findOne({ user })) || (await Chat.create({ user }));

    const ai = (await model.generateContent(prompt)).response.text();

    await ChatMessage.insertMany([
      { chat, role: "user", text: prompt },
      { chat, role: "ai",   text: ai },
    ]);

    return res.status(201).json({ answer: ai });
  }

 
  res.setHeader("Allow", ALLOWED_METHODS);
  return res.status(405).end();            
};
