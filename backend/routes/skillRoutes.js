const express = require("express");
const fs = require("fs");
const path = require("path");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const skillsFile = path.join(__dirname, "../data/skills.json");

function getSkills() {
    const data = fs.readFileSync(skillsFile, "utf8");
    return JSON.parse(data);
}

function saveSkills(skills) {
    fs.writeFileSync(
        skillsFile,
        JSON.stringify(skills, null, 2)
    );
}


// GET ALL SKILLS
router.get("/", (req, res) => {
    const skills = getSkills();

    let result = [...skills];

    const search = req.query.search;
    const category = req.query.category;
    const sort = req.query.sort;

    if (search) {
        result = result.filter(skill =>
            skill.name.toLowerCase().includes(search.toLowerCase()) ||
            skill.description.toLowerCase().includes(search.toLowerCase())
        );
    }

    if (category) {
        result = result.filter(
            skill =>
                skill.category.toLowerCase() === category.toLowerCase()
        );
    }

    if (sort === "rating") {
        result.sort((a, b) => b.rating - a.rating);
    }

    if (sort === "priceLow") {
        result.sort((a, b) => a.hourlyRate - b.hourlyRate);
    }

    if (sort === "priceHigh") {
        result.sort((a, b) => b.hourlyRate - a.hourlyRate);
    }

    res.json(result);
});


// GET SINGLE SKILL
router.get("/:id", (req, res) => {
    const skills = getSkills();

    const skill = skills.find(
        skill => skill.id === req.params.id
    );

    if (!skill) {
        return res.status(404).json({
            message: "Skill not found"
        });
    }

    res.json(skill);
});


// ADD SKILL
router.post("/", authMiddleware, (req, res) => {
    const {
        name,
        description,
        category,
        hourlyRate
    } = req.body;

    if (!name || !description || !category || hourlyRate === undefined) {
        return res.status(400).json({
            message: "All skill details are required"
        });
    }

    const skills = getSkills();

    const newSkill = {
        id: Date.now().toString(),
        mentorId: req.user.id,
        name,
        description,
        category,
        hourlyRate: Number(hourlyRate),
        rating: 0,
        reviewsCount: 0,
        createdAt: new Date().toISOString()
    };

    skills.push(newSkill);

    saveSkills(skills);

    res.status(201).json({
        message: "Skill added successfully",
        skill: newSkill
    });
});


// UPDATE SKILL
router.put("/:id", authMiddleware, (req, res) => {
    const skills = getSkills();

    const skillIndex = skills.findIndex(
        skill => skill.id === req.params.id
    );

    if (skillIndex === -1) {
        return res.status(404).json({
            message: "Skill not found"
        });
    }

    if (skills[skillIndex].mentorId !== req.user.id) {
        return res.status(403).json({
            message: "You can only edit your own skill"
        });
    }

    const {
        name,
        description,
        category,
        hourlyRate
    } = req.body;

    if (name !== undefined) {
        skills[skillIndex].name = name;
    }

    if (description !== undefined) {
        skills[skillIndex].description = description;
    }

    if (category !== undefined) {
        skills[skillIndex].category = category;
    }

    if (hourlyRate !== undefined) {
        skills[skillIndex].hourlyRate = Number(hourlyRate);
    }

    saveSkills(skills);

    res.json({
        message: "Skill updated successfully",
        skill: skills[skillIndex]
    });
});


// DELETE SKILL
router.delete("/:id", authMiddleware, (req, res) => {
    const skills = getSkills();

    const skillIndex = skills.findIndex(
        skill => skill.id === req.params.id
    );

    if (skillIndex === -1) {
        return res.status(404).json({
            message: "Skill not found"
        });
    }

    if (skills[skillIndex].mentorId !== req.user.id) {
        return res.status(403).json({
            message: "You can only delete your own skill"
        });
    }

    skills.splice(skillIndex, 1);

    saveSkills(skills);

    res.json({
        message: "Skill deleted successfully"
    });
});


module.exports = router;