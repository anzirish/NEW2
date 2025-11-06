import express from "express";
import { bookTickets, cancelTickets } from "../controllers/ticketController.js";
import { authorize } from "../middlewares/authorize.js";

export const ticketRouter = express.Router();

ticketRouter.use(authorize)

ticketRouter.post('/book', bookTickets);
ticketRouter.post('/cancel/:id', cancelTickets);