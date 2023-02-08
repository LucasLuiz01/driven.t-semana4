import hotelRepository from "@/repositories/hotel-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { notFoundError } from "@/errors";
import bookingRepository from "@/repositories/booking-repository";
import { cannotListHotelsError } from "@/errors/cannot-list-hotels-error";

export async function getBookingService (userId: number){
const findReserva = bookingRepository.findBooking(userId);
if(!findReserva) throw notFoundError();
return findReserva;
}

const bookingService = {
    getBookingService,
};

export default bookingService;
