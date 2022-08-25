const express = require("express");
// const { check } = require('express-validator');
const router = express.Router();

const skillController = require("../controllers/skillController");

router.post("/addskills", skillController.addskill);
router.post("/getSkills", skillController.getSkills);

module.exports = router;
