const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

let rooms = [];
let bookings = [];

// Create a room
app.post("/rooms", (req, res) => {
  const { roomName, seatsAvailable, pricePerHour } = req.body;
  const room = {
    id: rooms.length + 1,
    roomName,
    seatsAvailable,
    pricePerHour,
  };
  rooms.push(room);
  res.json(room);
});

// Book a room
app.post("/bookings", (req, res) => {
  const { customerName, dates, startTime, endTime, roomId } = req.body;
  const booking = {
    id: bookings.length + 1,
    customerName,
    dates,
    startTime,
    endTime,
    roomId,
  };
  bookings.push(booking);
  res.json(booking);
});

// List all rooms with booked data
app.get("/rooms/booked", (req, res) => {
  const result = rooms.map((room) => {
    const bookedData = bookings.filter((booking) => booking.roomId === room.id);
    return {
      roomName: room.roomName,
      bookedData: bookedData.map((booking) => ({
        customerName: booking.customerName,
        dates: booking.dates,
        startTime: booking.startTime,
        endTime: booking.endTime,
      })),
    };
  });
  res.json(result);
});

// List all customers with booked data
app.get("/customers/booked", (req, res) => {
  const result = [];
  bookings.forEach((booking) => {
    const room = rooms.find((room) => room.id === booking.roomId);
    result.push({
      customerName: booking.customerName,
      roomName: room.roomName,
      dates: booking.dates,
      startTime: booking.startTime,
      endTime: booking.endTime,
    });
  });
  res.json(result);
});

// List how many times a customer has booked the room
app.get("/customers/booked/:customerName", (req, res) => {
  const { customerName } = req.params;
  const result = bookings.filter(
    (booking) => booking.customerName === customerName
  );
  res.json(result);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
