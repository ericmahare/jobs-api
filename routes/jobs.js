const express = require("express");
const {
  allJobs,
  createJobs,
  getSingleJob,
  deleteJobs,
  updateJobs,
} = require("../controllers/jobsController");
// Router setup
const router = express.Router();
// routes
router.route("/").get(allJobs).post(createJobs);
router.route("/:id").get(getSingleJob).delete(deleteJobs).patch(updateJobs);

module.exports = router;
