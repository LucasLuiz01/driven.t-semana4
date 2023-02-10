
import { notFoundError } from "@/errors";
import bookingRepository from "@/repositories/booking-repository";
import roomRepository from "@/repositories/room-repository";
import { forbiddenError } from "@/errors";

export async function getBookingService (userId: number){
const findReserva = await bookingRepository.findBooking(userId);
if(!findReserva){
    throw notFoundError();
} 
console.log(findReserva)
return findReserva;
}

export async function postBookingService(roomId: number, userId: number){
    const roomIdExist = await roomRepository.findRom(roomId)
    if(!roomIdExist) {
        throw notFoundError()
    }
    console.log("TAMANHO", roomIdExist.Booking.length,roomIdExist.capacity )
    if(roomIdExist.Booking.length >= roomIdExist.capacity) throw forbiddenError();
    
   return await bookingRepository.createBooking(userId, roomId);
}

const bookingService = {
    getBookingService,
    postBookingService
};

export default bookingService;
