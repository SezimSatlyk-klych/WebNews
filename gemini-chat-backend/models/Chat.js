
const { Schema, model, Types } = require("mongoose");

const chatSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: { createdAt: "created_at" } }
);

module.exports = model("Chat", chatSchema);
