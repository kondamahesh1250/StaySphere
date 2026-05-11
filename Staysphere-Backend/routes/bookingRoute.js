require("dotenv").config();
const express = require("express");
const router = express.Router();
const Booking = require("../models/booking");
const moment = require("moment");
const Room = require("../models/room");
const { v4: uuidv4 } = require("uuid");
const Stripe = require("stripe");
const authMiddleware = require("../middleware/auth");
const stripe = new Stripe(process.env.STRIPE_KEY);

router.post("/bookroom", authMiddleware, async (req, res) => {
  const {
    room,
    userid,
    fromStartDate,
    toEndDate,
    totalAmount,
    totalDays,
    paymentMethodId,
    // token
  } = req.body;

  try {
    // const customer = await stripe.customers.create({
    //     email: token.email,
    //     source: token.id
    // });
    // const payment = await stripe.charges.create({
    //     amount: totalAmount * 100,
    //     customer: customer.id,
    //     currency: 'inr',
    //     receipt_email: token.email
    // }, {
    //     idempotencyKey: uuidv4()
    // }
    // );

    // Create PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount * 100, // paisa
      currency: "inr",
      payment_method: paymentMethodId,
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never",
      },
    });

    // Save booking AFTER payment success
    // if (paymentIntent.status === "succeeded") {
    //   const newBooking = new Booking({
    //     room,
    //     userid,
    //     fromDate,
    //     toDate,
    //     totalAmount,
    //     totalDays,
    //     transactionId: paymentIntent.id,
    //   });

    if (paymentIntent.status === "succeeded") {
      const newBooking = new Booking({
        room: room.name,
        roomid: room._id,
        userid,
        fromStartDate: moment(fromStartDate, "DD-MM-YYYY").format("DD-MM-YYYY"),
        toEndDate: moment(toEndDate, "DD-MM-YYYY").format("DD-MM-YYYY"),
        totalAmount,
        totalDays,
        transactionId: paymentIntent.id,
      });

      const booking = await newBooking.save();

      const roomTemp = await Room.findOne({ _id: room._id });

      roomTemp.currentbookings.push({
        bookingid: booking._id,
        fromStartDate: moment(fromStartDate, "DD-MM-YYYY").format("DD-MM-YYYY"),
        toEndDate: moment(toEndDate, "DD-MM-YYYY").format("DD-MM-YYYY"),
        userid: userid,
        status: booking.status,
      });

      await roomTemp.save();
      res.status(200).send("Payment Successfull, Your room is booked!");
    } else {
      res.status(400).json({ error: "Payment failed" });
    }
  } catch (error) {
    return res.status(500).json({ error });
  }
});

router.post("/getbookingsbyuserid", authMiddleware, async (req, res) => {
  const userid = req.body.userid;

  try {
    const bookings = await Booking.find({ userid: userid });
    res.status(200).send(bookings);
  } catch (error) {
    return res.status(500).json({ error });
  }
});

router.post("/cancelbooking", authMiddleware, async (req, res) => {
  const { bookingid, roomid } = req.body;

  try {
    const booking = await Booking.findOne({ _id: bookingid });
    booking.status = "cancelled";

    await booking.save();

    const room = await Room.findOne({ _id: roomid });
    const bookings = room.currentbookings;
    const tempBookings = bookings.filter(
      (booking) => booking.bookingid.toString() !== bookingid,
    );
    room.currentbookings = tempBookings;

    await room.save();

    res.status(200).send("Your booking cancelled successfully");
  } catch (error) {
    return res.status(500).json({ error });
  }
});

router.get("/getallbookings", authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.status(200).send(bookings);
  } catch (error) {
    return res.status(500).json({ error });
  }
});

module.exports = router;
