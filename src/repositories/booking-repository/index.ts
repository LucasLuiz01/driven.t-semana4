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

const bookingRepository = {
findBooking,
createBooking
}

export default bookingRepository;