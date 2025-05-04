
const { Schema, model, Types } = require("mongoose");

const chatMessageSchema = new Schema(
  {
    chat: { type: Types.ObjectId, ref: "Chat", required: true },
    role: { type: String, enum: ["user", "ai"], required: true },
    text: { type: String, required: true },
  },
  { timestamps: { createdAt: "created_at" } }
);

module.exports = model("ChatMessage", chatMessageSchema);
