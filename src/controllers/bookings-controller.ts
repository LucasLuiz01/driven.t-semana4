import { AuthenticatedRequest } from "@/middlewares";
import bookingService from "@/services/booking-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function putBookingController (req: AuthenticatedRequest, res: Response){
  const { userId } = req;
  const { roomId } = req.body;
  const { bookingId } = req.params;
  try {
    const bookings = await bookingService.putBookingService(Number(userId),Number(roomId),Number(bookingId));
    const bookingIds = {bookingId: bookings.id}
    return res.status(httpStatus.OK).send(bookingIds);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    if (error.name === "forbiddenError") {
      return res.sendStatus(httpStatus.FORBIDDEN);
    }
  }
}

export async function getBookingController (req: AuthenticatedRequest, res: Response){
    const { userId } = req;
    try {
      const bookings = await bookingService.getBookingService(Number(userId));
      return res.status(httpStatus.OK).send(bookings);
    } catch (error) {
      if (error.name === "NotFoundError") {
        return res.sendStatus(httpStatus.NOT_FOUND);
      }
    }
}

export async function createBookingController(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  //TODO validação do JOI
  const { roomId } = req.body;

  if (!roomId) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }

  try {
    const booking = await bookingService.postBookingService(Number(roomId), Number(userId));
    const bookingIds = {bookingId: booking.id}
     res.status(200).send(bookingIds);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    if (error.name === "forbiddenError") {
      return res.sendStatus(httpStatus.FORBIDDEN);
    }
  }
}
