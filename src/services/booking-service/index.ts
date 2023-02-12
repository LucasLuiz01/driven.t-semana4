
import { notFoundError } from "@/errors";
import bookingRepository from "@/repositories/booking-repository";
import roomRepository from "@/repositories/room-repository";
import { forbiddenError } from "@/errors";

async function getBookingService (userId: number){
const findReserva = await bookingRepository.findBooking(userId);
if(!findReserva){
    throw notFoundError();
} 
console.log(findReserva)
return findReserva;
}
async function putBookingService (userId: number, roomId: number, bookingId: number){
    const findRoom = await roomRepository.findRom(roomId);
    if(!findRoom) throw notFoundError();
    if(findRoom.Booking.length >= findRoom.capacity) throw forbiddenError();
    await bookingRepository.deleteBooking(bookingId);
    const fazendoReserva = await bookingRepository.createBooking(userId, roomId);
    return fazendoReserva
 }

async function postBookingService(roomId: number, userId: number){
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
    postBookingService,
    putBookingService
};

export default bookingService;
