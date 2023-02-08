import { Router } from "express";
import { authenticateToken } from "@/middlewares";

const bookingsRouters = Router();

bookingsRouters
    .all("/*", authenticateToken)
    .get("/")
    .post("/")
    .put("/:bookingId")

export {bookingsRouters};
