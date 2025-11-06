import { Event } from "../models/Event.js";
import { Ticket } from "../models/Ticket.js";
import { User } from "../models/User.js";
import { sendEmail } from "../utils/sendEmail.js";

export const bookTickets = async (req, res, next) => {
  try {
    const { eventId, quantity } = req.body;
    const userId = req.user.userId;

    if (!eventId || !quantity || quantity <= 0) {
      return res
        .status(400)
        .json({ msg: "Event ID and valid quantity are required" });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ msg: "Event not found" });
    }

    const totalAmount = event.basePrice * quantity;

    const ticket = new Ticket({
      userId,
      eventId,
      quantity,
      totalAmount,
      status: "booked",
    });

    await ticket.save();

    const user = await User.findById(userId);
    await sendEmail(
      user.email,
      "Ticket Booking Confirmation",
      `Your ticket for ${event.name} has been booked successfully! Quantity: ${quantity}, Total Amount: $${totalAmount}. Booking ID: ${ticket._id}`
    );

    return res.status(201).json({
      msg: "Tickets booked successfully",
      ticket: {
        id: ticket._id,
        eventName: event.name,
        quantity,
        totalAmount,
        status: ticket.status,
        bookedAt: ticket.bookedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const cancelTickets = async (req, res, next) => {
  try {
    const ticketId = req.params.id;
    const userId = req.user.userId;

    if (!ticketId) {
      return res.status(400).json({ msg: "Ticket ID is required" });
    }

    const ticket = await Ticket.findById(ticketId).populate("eventId");
    if (!ticket) {
      return res.status(404).json({ msg: "Ticket not found" });
    }

    if (ticket.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ msg: "You can only cancel your own tickets" });
    }

    if (ticket.status === "canceled") {
      return res.status(400).json({ msg: "Ticket is already canceled" });
    }

    ticket.status = "canceled";
    await ticket.save();

    const user = await User.findById(userId);
    await sendEmail(
      user.email,
      "Ticket Cancellation Confirmation",
      `Your ticket for ${ticket.eventId.name} has been cancelled successfully. Refund of $${ticket.totalAmount} will be processed within 3-5 business days. Booking ID: ${ticket._id}`
    );

    return res.status(200).json({
      msg: "Ticket canceled successfully",
      ticket: {
        id: ticket._id,
        eventName: ticket.eventId.name,
        quantity: ticket.quantity,
        totalAmount: ticket.totalAmount,
        status: ticket.status,
      },
    });
  } catch (error) {
    next(error);
  }
};
