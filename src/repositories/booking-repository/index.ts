import { prisma } from "@/config";

async function findBooking(userId : number) {
return await prisma.booking.findFirst({
    where:{
        userId
    },
    select:{
        id: true,
        Room: true
    }
})
}

async function createBooking(userId: number, roomId: number){
   return await prisma.booking.create({
        data:{
            roomId,
            userId
        }
    })
}
async function deleteBooking(bookingId:number){
    await prisma.booking.delete({
        where:{
            id: bookingId
        }
    })
}

const bookingRepository = {
findBooking,
createBooking,
deleteBooking
}

export default bookingRepository;