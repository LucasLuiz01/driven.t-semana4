import { prisma } from "@/config";

//Sabe criar objetos - Create Booking
export async function createBooking(roomId:number, userId:number) {
    return await prisma.booking.create({
        data:{
            roomId,
            userId
        }
    })
}