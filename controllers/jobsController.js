const Job = require("../models/Job");

// Get all jobs
exports.allJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ createdBy: req.user.userID }).sort(
      "-createdAt"
    );
    res.status(200).json({ result: jobs.length, jobs });
  } catch (error) {
    res.status(400).json(error);
  }
};
// Create jobs
exports.createJobs = async (req, res) => {
  const { company, position } = req.body;
  if (!company || !position) {
    return res.status(400).json({
      msg: "Please provide company and position",
    });
  }
  req.body.createdBy = req.user.userID;
  try {
    const job = await Job.create({ ...req.body });
    res.status(201).json({
      status: "success",
      job,
    });
  } catch (error) {
    return res.status(400).json({
      msg: error,
    });
  }
};

// Update jobs
exports.updateJobs = async (req, res) => {
  const {
    user: { userID },
    params: { id: jobID },
    body: { company, position },
  } = req;
  if (!company || !position) {
    return res.status(400).json({
      msg: "Company or position fields cannot be empty",
    });
  }
  const job = await Job.findByIdAndUpdate(
    { _id: jobID, createdBy: userID },
    req.body,
    {
      runValidators: true,
      new: true,
    }
  );
  res.status(200).json({ job });
};

// Get single job
exports.getSingleJob = async (req, res) => {
  const {
    user: { userID },
    params: { id: jobID },
  } = req;
  try {
    const job = await Job.findOne({ _id: jobID, createdBy: userID });
    if (!job) {
      res.status(400).json({
        msg: "Job not found",
      });
    }
    res.status(200).json({
      job,
    });
  } catch (error) {
    res.json({ error });
  }
};

// Delete job
exports.deleteJobs = async (req, res) => {
  const {
    user: { userID },
    params: { id: jobID },
  } = req;
  const job = await Job.findOneAndRemove({ _id: jobID, createdBy: userID });
  if (!job) {
    return res.status(400).json({
      msg: "Specified job not found",
    });
  }
  res.status(200).json({
    msg: "Job deleted successfully!",
  });
};
