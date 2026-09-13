const express = require("express");
const fs = require("fs");
const path = require("path");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const reviewsFile = path.join(__dirname, "../data/reviews.json");
const bookingsFile = path.join(__dirname, "../data/bookings.json");
const skillsFile = path.join(__dirname, "../data/skills.json");

function getReviews() {
    return JSON.parse(fs.readFileSync(reviewsFile, "utf8"));
}

function saveReviews(reviews) {
    fs.writeFileSync(
        reviewsFile,
        JSON.stringify(reviews, null, 2)
    );
}

function getBookings() {
    return JSON.parse(fs.readFileSync(bookingsFile, "utf8"));
}

function getSkills() {
    return JSON.parse(fs.readFileSync(skillsFile, "utf8"));
}

function saveSkills(skills) {
    fs.writeFileSync(
        skillsFile,
        JSON.stringify(skills, null, 2)
    );
}


// ADD REVIEW
router.post("/", authMiddleware, (req, res) => {
    try {
        const {
            bookingId,
            rating,
            comment
        } = req.body;

        if (!bookingId || rating === undefined || !comment) {
            return res.status(400).json({
                message: "Booking, rating and comment are required"
            });
        }

        const numericRating = Number(rating);

        if (
            !Number.isInteger(numericRating) ||
            numericRating < 1 ||
            numericRating > 5
        ) {
            return res.status(400).json({
                message: "Rating must be between 1 and 5"
            });
        }

        const bookings = getBookings();

        const booking = bookings.find(
            booking => booking.id === bookingId
        );

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        if (booking.learnerId !== req.user.id) {
            return res.status(403).json({
                message: "Only the learner can submit a review"
            });
        }

        if (booking.status !== "completed") {
            return res.status(400).json({
                message: "You can review only completed sessions"
            });
        }

        const reviews = getReviews();

        const existingReview = reviews.find(
            review => review.bookingId === bookingId
        );

        if (existingReview) {
            return res.status(400).json({
                message: "You have already reviewed this session"
            });
        }

        const newReview = {
            id: Date.now().toString(),
            bookingId,
            skillId: booking.skillId,
            learnerId: booking.learnerId,
            mentorId: booking.mentorId,
            rating: numericRating,
            comment,
            createdAt: new Date().toISOString()
        };

        reviews.push(newReview);

        saveReviews(reviews);

        // Update skill rating
        const skills = getSkills();

        const skillIndex = skills.findIndex(
            skill => skill.id === booking.skillId
        );

        if (skillIndex !== -1) {
            const skillReviews = reviews.filter(
                review => review.skillId === booking.skillId
            );

            const totalRating = skillReviews.reduce(
                (total, review) => total + review.rating,
                0
            );

            skills[skillIndex].rating =
                Number((totalRating / skillReviews.length).toFixed(1));

            skills[skillIndex].reviewsCount =
                skillReviews.length;

            saveSkills(skills);
        }

        res.status(201).json({
            message: "Review submitted successfully",
            review: newReview
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to submit review"
        });
    }
});


// GET REVIEWS FOR A SKILL
router.get("/skill/:skillId", (req, res) => {
    try {
        const reviews = getReviews();

        const skillReviews = reviews.filter(
            review => review.skillId === req.params.skillId
        );

        res.json(skillReviews);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch reviews"
        });
    }
});


// GET REVIEWS RECEIVED BY MENTOR
router.get("/mentor/:mentorId", (req, res) => {
    try {
        const reviews = getReviews();

        const mentorReviews = reviews.filter(
            review => review.mentorId === req.params.mentorId
        );

        res.json(mentorReviews);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch mentor reviews"
        });
    }
});


// GET MY REVIEWS
router.get("/my", authMiddleware, (req, res) => {
    try {
        const reviews = getReviews();

        const myReviews = reviews.filter(
            review =>
                review.learnerId === req.user.id ||
                review.mentorId === req.user.id
        );

        res.json(myReviews);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch reviews"
        });
    }
});


module.exports = router;