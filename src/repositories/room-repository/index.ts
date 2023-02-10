import { prisma } from "@/config";

async function findRom(roomId: number) {
  return await prisma.room.findFirst({
    where:{
        id: roomId
    },
    include:{
        Booking: true
    }
  })
}


const roomRepository = {
    findRom,
};

export default roomRepository;
