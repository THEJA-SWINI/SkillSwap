const express = require("express");
const fs = require("fs");
const path = require("path");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const bookingsFile = path.join(__dirname, "../data/bookings.json");
const skillsFile = path.join(__dirname, "../data/skills.json");

function getBookings() {
    return JSON.parse(fs.readFileSync(bookingsFile, "utf8"));
}

function saveBookings(bookings) {
    fs.writeFileSync(
        bookingsFile,
        JSON.stringify(bookings, null, 2)
    );
}

function getSkills() {
    return JSON.parse(fs.readFileSync(skillsFile, "utf8"));
}


// CREATE BOOKING
router.post("/", authMiddleware, (req, res) => {
    try {
        const {
            skillId,
            date,
            startTime,
            endTime,
            purpose
        } = req.body;

        if (!skillId || !date || !startTime || !endTime || !purpose) {
            return res.status(400).json({
                message: "All booking details are required"
            });
        }

        if (startTime >= endTime) {
            return res.status(400).json({
                message: "End time must be after start time"
            });
        }

        const skills = getSkills();

        const skill = skills.find(
            skill => skill.id === skillId
        );

        if (!skill) {
            return res.status(404).json({
                message: "Skill not found"
            });
        }

        if (skill.mentorId === req.user.id) {
            return res.status(400).json({
                message: "You cannot book your own skill"
            });
        }

        const bookings = getBookings();

        const overlappingBooking = bookings.find(booking =>
            booking.skillId === skillId &&
            booking.date === date &&
            (booking.status === "pending" ||
             booking.status === "accepted") &&
            startTime < booking.endTime &&
            endTime > booking.startTime
        );

        if (overlappingBooking) {
            return res.status(409).json({
                message: "This time slot is already booked"
            });
        }

        const newBooking = {
            id: Date.now().toString(),
            skillId,
            skillName: skill.name,
            learnerId: req.user.id,
            mentorId: skill.mentorId,
            date,
            startTime,
            endTime,
            purpose,
            status: "pending",
            createdAt: new Date().toISOString()
        };

        bookings.push(newBooking);

        saveBookings(bookings);

        res.status(201).json({
            message: "Booking created successfully",
            booking: newBooking
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to create booking"
        });
    }
});


// GET MY BOOKINGS
router.get("/my", authMiddleware, (req, res) => {
    try {
        const bookings = getBookings();

        const myBookings = bookings.filter(
            booking => booking.learnerId === req.user.id
        );

        res.json(myBookings);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch bookings"
        });
    }
});


// GET INCOMING BOOKINGS FOR MENTOR
router.get("/incoming", authMiddleware, (req, res) => {
    try {
        const bookings = getBookings();

        const incomingBookings = bookings.filter(
            booking => booking.mentorId === req.user.id
        );

        res.json(incomingBookings);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch incoming bookings"
        });
    }
});


// GET SINGLE BOOKING
router.get("/:id", authMiddleware, (req, res) => {
    try {
        const bookings = getBookings();

        const booking = bookings.find(
            booking => booking.id === req.params.id
        );

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        if (
            booking.learnerId !== req.user.id &&
            booking.mentorId !== req.user.id
        ) {
            return res.status(403).json({
                message: "Access denied"
            });
        }

        res.json(booking);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch booking"
        });
    }
});


// ACCEPT OR REJECT BOOKING
router.put("/:id/status", authMiddleware, (req, res) => {
    try {
        const { status } = req.body;

        if (!["accepted", "rejected"].includes(status)) {
            return res.status(400).json({
                message: "Status must be accepted or rejected"
            });
        }

        const bookings = getBookings();

        const bookingIndex = bookings.findIndex(
            booking => booking.id === req.params.id
        );

        if (bookingIndex === -1) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        const booking = bookings[bookingIndex];

        if (booking.mentorId !== req.user.id) {
            return res.status(403).json({
                message: "Only the mentor can update booking status"
            });
        }

        if (booking.status !== "pending") {
            return res.status(400).json({
                message: "Only pending bookings can be updated"
            });
        }

        booking.status = status;

        saveBookings(bookings);

        res.json({
            message: `Booking ${status} successfully`,
            booking
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update booking"
        });
    }
});


// CANCEL BOOKING
router.put("/:id/cancel", authMiddleware, (req, res) => {
    try {
        const bookings = getBookings();

        const bookingIndex = bookings.findIndex(
            booking => booking.id === req.params.id
        );

        if (bookingIndex === -1) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        const booking = bookings[bookingIndex];

        if (booking.learnerId !== req.user.id) {
            return res.status(403).json({
                message: "Only the learner can cancel this booking"
            });
        }

        if (
            booking.status === "completed" ||
            booking.status === "cancelled"
        ) {
            return res.status(400).json({
                message: "This booking cannot be cancelled"
            });
        }

        booking.status = "cancelled";

        saveBookings(bookings);

        res.json({
            message: "Booking cancelled successfully",
            booking
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to cancel booking"
        });
    }
});


// MARK BOOKING AS COMPLETED
router.put("/:id/complete", authMiddleware, (req, res) => {
    try {
        const bookings = getBookings();

        const bookingIndex = bookings.findIndex(
            booking => booking.id === req.params.id
        );

        if (bookingIndex === -1) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        const booking = bookings[bookingIndex];

        if (booking.mentorId !== req.user.id) {
            return res.status(403).json({
                message: "Only the mentor can complete the booking"
            });
        }

        if (booking.status !== "accepted") {
            return res.status(400).json({
                message: "Only accepted bookings can be completed"
            });
        }

        booking.status = "completed";

        saveBookings(bookings);

        res.json({
            message: "Booking completed successfully",
            booking
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to complete booking"
        });
    }
});


module.exports = router;