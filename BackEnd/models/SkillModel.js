const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SkillSchema = new Schema({
  userid: { type: String, required: true },
  skills: { type: Array, required: true },
});

module.exports = mongoose.model("SkillModel", SkillSchema);
