import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getBookingController } from "@/controllers";
import { createBookingController } from "@/controllers";

const bookingsRouters = Router();

bookingsRouters
    .all("/*", authenticateToken)
    .get("/", getBookingController)
    .post("/", createBookingController)
    .put("/:bookingId")

export {bookingsRouters};
