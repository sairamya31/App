const Jobs = require("../models/JobModel");
const CurrJobs = require("../models/CurrJobModel");
const HttpError = require("../models/http-error");
const express = require("express");
const fs = require("fs");
const Dataset = require("../JsonData/jobs.json");
const skillSearch = require("../JsonData/jobsearch.json");
const search = (req, res, next) => {
  // console.log("sanju")
  console.log(req.body);
  const toSearch = req.body.search;
  console.log(typeof toSearch);
  const place = req.body.place;

  const response = Dataset.filter((data) =>
    data.job_description.includes(toSearch)
  );
  const details = response.map((data) => {
    return {
      company: data.company_name,
      title: data.job_title,
      fromSalary: data.inferred_salary_from,
      toSalary: data.inferred_salary_to,
      city: data.city,
      category: data.category,
    };
  });
  console.log(details);
  res.json(details);
};
const loginsearch = async (req, res, next) => {
  // console.log(req.body)
  const search = req.body.search;
  const place = req.body.place;
  console.log(skillSearch);
  const response = skillSearch.filter(
    (data) =>
      data.joblocation_address.includes(place) && data.jobtitle.includes(search)
  );

  // console.log(response)
  const details = response.map((data) => {
    return {
      company: data.company,
      title: data.jobtitle,
      salary: data.payrate,
      city: data.joblocation_address,
      skills: data.skills,
    };
  });
  console.log(details);
  res.json(details);
};


const getsalaray = async (req, res, next) => {
  // console.log(req.body)
  const response = skillSearch.filter(
    (data) =>
      data
  );

  // console.log(response)
  const details = response.map((data) => {
    return {
      experience: data.experience,
      salary: data.payrate,
    };
  });
  console.log(details);
  res.json(details);
};



const getprevjobs = async (req, res, next) => {
  const { userid } = req.body;
  // console.log(userid)
  const getjobs = await Jobs.find({ userid: userid });
  // console.log(getJobs,"checking");
  // console.log(getjobs);
  res.json(getjobs);
};

const getcurrjobs = async (req, res, next) => {
  const { userid } = req.body;
  // console.log(userid)
  const getcurrjobs = await CurrJobs.find({ userid: userid });
  // console.log(getJobs,"checking");
  res.json(getcurrjobs);
};

const getjobssalary = async (req, res, next) => {
  const { userid } = req.body;
  const getjobssalary = await Jobs.find({ userid: userid });
  let salaryarray = [];
  for (let i = 0; i < getjobssalary.length; i++) {
    salaryarray.push(getjobssalary[i].salary);
  }
  res.json(salaryarray);
};

const getjobsname = async (req, res, next) => {
  const { userid } = req.body;
  const getjobsname = await Jobs.find({ userid: userid });
  let namearray = [];
  for (let i = 0; i < getjobsname.length; i++) {
    namearray.push(getjobsname[i].compname);
  }
  res.json(namearray);
};

const prevjobs = async (req, res, next) => {
  console.log(req.body);
  const { compname, duration, salary, position, location, userid } = req.body;
  let previousJobs;
  previousJobs = await Jobs.findOne({ compname: compname,userid:userid });
  if (previousJobs) {
    const error = new HttpError(
      "Job exists already, please add different job",
      422
    );
    return next(error);
  }

  const addJob = new Jobs({
    compname: compname,
    duration: duration,
    position: position,
    salary: salary,
    location: location,
    userid: userid,
  });
  try {
    await addJob.save();
  } catch (err) {
    console.log("saving error");
    const error = new HttpError(
      "Adding Job failed, please try again later.",
      500
    );
    return next(error);
  }
  // console.log(newJob)
  res.json({ job: addJob });
};

const addcurrjobs = async (req, res, next) => {
  const { compname, duration, salary, position, location, userid } = req.body;
  let currentJobs;
  currentJobs = await CurrJobs.findOne({ compname: compname,userid:userid });
  if (currentJobs) {
    const error = new HttpError(
      "Job exists already, please add different job",
      422
    );
    return next(error);
  }
else{
  const addcurJob = new CurrJobs({
    compname: compname,
    duration: duration,
    position: position,
    salary: salary,
    location: location,
    userid: userid,
  });
  try {
    await addcurJob.save();
  } catch (err) {
    console.log("saving error");
    const error = new HttpError(
      "Adding Job failed, please try again later.",
      500
    );
    return next(error);
  }
  res.json({ job: addcurJob });
}
  // console.log(newJob)
};

const recommendjobs = async(req,res)=>{
const {user} =  req.body
const skill = req.body.skill;
console.log(skill,"mil gaya",user)
const required_arr  = []
skillSearch.map(data=>{
  let matches = []
  data.skills.filter(item=> {
  let sumn = skill.filter(dat=>dat===item);
  // console.log(sumn)
  if(sumn.length > 0){
    // console.log(sumn)
    matches.push(sumn[0]);
    return true;
  }
    return false;
    })
    if(matches.length > 0){
      required_arr.push({...data, matched: matches.length})
    }
  }
  )
  // console.log(required_arr)
  let sorted =[]
if(required_arr){
  sorted = required_arr.slice().sort((a,b)=> b.matched- a.matched);
}
// console.log(sorted)
const toSend = sorted.slice(0,10)
res.json(toSend)
}

exports.prevjobs = prevjobs;
exports.addcurrjobs = addcurrjobs;
exports.getprevjobs = getprevjobs;
exports.search = search;
exports.getjobssalary = getjobssalary;
exports.getjobsname = getjobsname;
exports.loginsearch = loginsearch;
exports.getcurrjobs = getcurrjobs;
exports.getsalaray = getsalaray;

exports.recommendjobs = recommendjobs
// const targetURL = `https://api.adzuna.com/v1/api/jobs/in/search/1?&results_per_page=20&content-type=application/json&app_id=da3b4b1b&app_key=36a0c2ed8bb2374466527f58761a7f3d&what=${toSearch}&where=${place}`;

// axios.get(targetURL)
//   .then(response => {
// res.writeHead(200, headers);
// console.log(response.data);
// const sendResponse = response.data.results
// res.json({sendResponse})
// console.log(sendResponse)
// const requiredinfo = sendResponse.map((i) => {
//   return ({
//     id: i.id,
//     title: i.title,
//     company: i.company.display_name,
//     description: i.description,
//     location: i.location.display_name,
//     url:i.redirect_url
//   })
// })
// res.json({ requiredinfo })

// }).catch(response => {
// res.writeHead(500, headers);
//   console.log('error');
// });