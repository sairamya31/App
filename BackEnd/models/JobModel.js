const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const JobSchema = new Schema({
  compname:  {type: String, required: true },
  duration:  {type: String, required: true},
   position: {type: String, required: true},
  salary:    {type:Number, required:true},
  location:  {type:String,required:true},
  userid :    {type:String,required:true}
});


module.exports = mongoose.model('JobModel', JobSchema);