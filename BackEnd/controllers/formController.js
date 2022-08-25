const jobSc = require("../models/formModel");
const HttpError = require("../models/http-error");
const JobModel = require("../models/JobModel");

// const ScoreDetails = async (req, res) => {
//   const { user } = req.body;
//   const id = ObjectId(user);
//   // console.log(id)
//   const dets = await JobModel.find({ _id: id });
//   // console.log(dets)
//   if (dets) {
//     res.json(dets);
//   } else {
//     res.json("No user found");
//   }
// };

const addJobScore = async (req, res, next) => {
  const { userid, jobScore } = req.body;
  console.log(jobSc);
  // console.log(skills)
  let exisitingScore;
  exisitingScore = await jobSc.findOne({ userid: userid});
  console.log(exisitingScore);
  if (exisitingScore) {
    try {
      // const result = await jobSc.updateOne(
      //   { userid: userid,companyName: companyName },
      //   {
      //     $set: {
      //       jobScore: jobScore,
      //       companyName: companyName,
      //     },
      //   }
      // );
      const result = new jobSc({
        userid: userid,
        jobScore: jobScore,
      });
      console.log(result);
    } catch (err) {
      console.log(err);
    }
  } else {
    const exisitingScore = new jobSc({
      userid: userid,
      jobScore: jobScore,
    });

    try {
      try {
        await exisitingScore.save();
      } catch (err) {
        console.log(err);
      }
    } catch (err) {
      console.log(exisitingScore);
      const error = new HttpError(
        "Adding job score failed, please try again later.",
        500
      );
      return next(error);
    }
  }
  const updatedJobScore = await jobSc.findOne({ userid: userid });
  res.json({ jobScore: updatedJobScore });
};

const getJobScore = async (req, res, next) => {
  const { userid } = req.body;
  console.log(req.body);
  console.log('hjfbhejbhj')
  let exisitingScore;
  exisitingScore = await jobSc.findOne({ userid: userid});
  // console.log(exisitingScore.jobScore);
  if (exisitingScore) {
    res.json(exisitingScore.jobScore);
  } else {
    res.json([]);
  }
};

exports.addJobScore = addJobScore;
exports.getJobScore = getJobScore;
// exports.getJobScore = getJobScore;
