const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const formSchema = new Schema({
  userid: { type: String, required: true },
  jobScore: { type: Number, required: true },
  companyName: { type: String, required: true },
});

module.exports = mongoose.model("formModel", formSchema);
