const Skills = require("../models/SkillModel");
const HttpError = require("../models/http-error");

const addskill = async (req, res, next) => {
  const { userid, skills } = req.body;
  console.log(skills);
  let existingSkills;
  existingSkills = await Skills.findOne({ userid: userid });
  if (existingSkills) {
    try {
      const result = await Skills.updateOne(
        { userid: userid },
        {
          $set: {
            skills: skills,
          },
        }
      );
      // console.log(result)
    } catch (err) {
      console.log(err);
    }
  } else {
    const existingSkills = new Skills({
      userid: userid,
      skills: skills,
    });

    try {
      try {
        await existingSkills.save();
      } catch (err) {
        console.log(err);
      }
    } catch (err) {
      console.log(existingSkills);
      const error = new HttpError(
        "Adding Skill failed, please try again later.",
        500
      );
      return next(error);
    }
  }
  const updatedSkills = await Skills.findOne({ userid: userid });
  console.log(updatedSkills);
  res.json({ skill: updatedSkills });
};

const getSkills = async (req, res, next) => {
  const { userid } = req.body;
  // console.log(user)
  let existingSkills;
  existingSkills = await Skills.findOne({ userid });
  console.log(existingSkills, "neww");
  if (existingSkills) {
    res.json(existingSkills.skills);
  } else {
    res.json([]);
  }
};

exports.addskill = addskill;
exports.getSkills = getSkills;
