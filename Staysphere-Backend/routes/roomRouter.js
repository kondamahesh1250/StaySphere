const express = require("express");
const router = express.Router();

const Room = require("../models/room");
const authMiddleware = require("../middleware/auth");

router.get("/getallrooms", async (req, res) => {
  try {
    const rooms = await Room.find({});
    res.status(200).send(rooms);
  } catch (error) {
    res.status(500).send({ error });
  }
});

router.post("/getroombyid", async (req, res) => {
  const roomid = req.body.roomid;
  try {
    const room = await Room.findOne({ _id: roomid });
    res.status(200).send(room);
  } catch (error) {
    res.status(500).send({ error });
  }
});

router.post("/addroom", authMiddleware, async (req, res) => {
  try {
    const room = new Room(req.body);
    await room.save();
    res.status(201).send("New Room Added Successfully");
  } catch (error) {
    res.status(500).send({ error });
  }
});

router.put("/update/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, rentperday, maxcount, phonenumber } = req.body;

    const room = await Room.findById(id);

    room.name = name;
    room.type = type;
    room.rentperday = rentperday;
    room.maxcount = maxcount;
    room.phonenumber = phonenumber;

    await room.save();

    res.status(200).send(room);
  } catch (error) {
    res.status(400).send({ error });
  }
});

router.delete("/delete/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    await Room.findByIdAndDelete(id);
    res.status(200).send("Room Deleted");
  } catch (error) {
    res.status(500).send({ error });
  }
});

module.exports = router;
