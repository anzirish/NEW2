import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ["concert", "sports", "conference", "comedy"],
    },
    date: { type: Date, required: true },
    basePrice: { type: Number, required: true },
  },
  { timestamps: true }
);

export const Event = mongoose.model("Event", eventSchema);
