import mongoose from "mongoose";
import { Event } from "./Event.js";

const ticketSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  quantity: { type: Number, required: true },
  totalAmount: { type: Number },
  status: { type: String, enum: ["booked", "canceled"], default: "booked" },
  bookedAt: { type: Date, default: Date.now },
});

export const Ticket = mongoose.model("Ticket", ticketSchema);
