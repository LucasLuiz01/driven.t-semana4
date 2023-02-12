import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getBookingController } from "@/controllers";
import { createBookingController } from "@/controllers";
import { putBookingController } from "@/controllers";

const bookingsRouters = Router();

bookingsRouters
    .all("/*", authenticateToken)
    .get("/", getBookingController)
    .post("/", createBookingController)
    .put("/:bookingId", putBookingController)

export {bookingsRouters};
