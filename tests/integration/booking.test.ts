import app, { init } from "@/app";
import { prisma } from "@/config";
import faker from "@faker-js/faker";
import { TicketStatus } from "@prisma/client";
import { create } from "domain";
import { response } from "express";
import httpStatus from "http-status";
import * as jwt from "jsonwebtoken";
import supertest from "supertest";
import {
    createEnrollmentWithAddress,
    createUser,
    createTicketType,
    createTicket,
    createPayment,
    generateCreditCardData,
    createTicketTypeWithHotel,
    createTicketTypeRemote,
    createHotel,
    createRoomWithHotelId,
    createBooking
} from "../factories";
import { cleanDb, generateValidToken } from "../helpers";

beforeAll(async () => {
    await init();
});

beforeEach(async () => {
    await cleanDb();
});

const server = supertest(app);

describe("GET/booking", () => {
    it("should responde with status 401 if no token is given", async () => {
        const response = await server.get("/booking");

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    })
    it("shold respond with status 401 if given token is not valid", async () => {
        const token = faker.lorem.word();
        const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    })
    it("should respond with status 401 if there is no session for given token", async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET)

        const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(httpStatus.UNAUTHORIZED)
    })
    it("should respond with status 404 when user dont have booking", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        //Consultar Booking sem reserva
        const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(httpStatus.NOT_FOUND)

    })
    it("should respond with status 200 and list booking", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeWithHotel();
        const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        const payment = await createPayment(ticket.id, ticketType.price);
        //TODO factory
        const createdHotel = await createHotel();
        const createdRoom = await createRoomWithHotelId(createdHotel.id);
        const createBook = await createBooking(createdRoom.id, user.id);

        const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toEqual({
            id: createBook.id,
            Room: {
                id: createdRoom.id,
                name: createdRoom.name,
                capacity: createdRoom.capacity,
                hotelId: createdHotel.id,
                createdAt: createdRoom.createdAt.toISOString(),
                updatedAt: createdRoom.updatedAt.toISOString(),
            }
        })


    })
})
describe("POST/booking", () => {
    it("should responde with status 401 if no token is given", async () => {
        const response = await server.post("/booking");

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    })
    it("shold respond with status 401 if given token is not valid", async () => {
        const token = faker.lorem.word();
        const response = await server.post("/booking").set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    })
    it("should respond with status 401 if there is no session for given token", async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET)

        const response = await server.post("/booking").set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(httpStatus.UNAUTHORIZED)
    })
    it("should respond with status 404 when roomId is not present in body", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        //Consultar Booking sem reserva
        const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send({});
        expect(response.status).toBe(httpStatus.NOT_FOUND)

    })
    it("should respond with status 404 when roomId is invalid", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        //Consultar Booking sem reserva
        const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send({ roomId: 0 });
        expect(response.status).toBe(httpStatus.NOT_FOUND)
    })
    it("should respond with status 403 when room is vacant", async () => {
        const user = await createUser();
        const user2 = await createUser();
        const user3 = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeWithHotel();
        const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        const payment = await createPayment(ticket.id, ticketType.price);
        //TODO factory
        const createdHotel = await createHotel();
        const createdRoom = await createRoomWithHotelId(createdHotel.id);
        const createBook = await createBooking(createdRoom.id, user.id);
        const createBook2 = await createBooking(createdRoom.id, user2.id);
        const createBook3 = await createBooking(createdRoom.id, user3.id);
        //Consultar Booking sem reserva
        const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send({ roomId: createdRoom.id });
        expect(response.status).toBe(httpStatus.FORBIDDEN)
    })
    it("should respond with status 200 and bookingId", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeWithHotel();
        const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        const payment = await createPayment(ticket.id, ticketType.price);
        //TODO factory
        const createdHotel = await createHotel();
        const createdRoom = await createRoomWithHotelId(createdHotel.id);
        //Consultar Booking sem reserva
        const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send({ roomId: createdRoom.id });
        expect(response.status).toBe(httpStatus.OK)
        expect(response.body).toEqual({
            bookingId: expect.any(Number)
        })
    })
})

