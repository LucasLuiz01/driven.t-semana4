import { AuthenticatedRequest } from "@/middlewares";
import bookingService from "@/services/booking-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getBookingController (req: AuthenticatedRequest, res: Response){
    const { userId } = req;
    try {
      const bookings = await bookingService.getBookingService(Number(userId));
      return res.status(httpStatus.OK).send(bookings);
    } catch (error) {
      if (error.name === "NotFoundError") {
        return res.sendStatus(httpStatus.NOT_FOUND);
      }
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }
}