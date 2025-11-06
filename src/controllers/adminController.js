import { Ticket } from "../models/Ticket.js";
import { Event } from "../models/Event.js";
import { User } from "../models/User.js";

export const getReports = async (req, res, next) => {
  try {
    const totalTicketsBooked = await Ticket.countDocuments({ status: "booked" });
    const totalTicketsCanceled = await Ticket.countDocuments({ status: "canceled" });
    
    const revenueResult = await Ticket.aggregate([
      { $match: { status: "booked" } },
      { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    const totalUsers = await User.countDocuments();
    const totalEvents = await Event.countDocuments();

    const ticketsByEvent = await Ticket.aggregate([
      {
        $lookup: {
          from: "events",
          localField: "eventId",
          foreignField: "_id",
          as: "event"
        }
      },
      { $unwind: "$event" },
      {
        $group: {
          _id: "$eventId",
          eventName: { $first: "$event.name" },
          totalTickets: { $sum: "$quantity" },
          totalRevenue: { $sum: "$totalAmount" },
          bookedTickets: {
            $sum: { $cond: [{ $eq: ["$status", "booked"] }, "$quantity", 0] }
          },
          canceledTickets: {
            $sum: { $cond: [{ $eq: ["$status", "canceled"] }, "$quantity", 0] }
          }
        }
      },
      { $sort: { totalRevenue: -1 } }
    ]);

    return res.status(200).json({
      msg: "Reports generated successfully",
      summary: {
        totalUsers,
        totalEvents,
        totalTicketsBooked,
        totalTicketsCanceled,
        totalRevenue
      },
      eventReports: ticketsByEvent
    });
  } catch (error) {
    next(error);
  }
};