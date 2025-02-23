import { Router } from "https://deno.land/x/oak/mod.ts";
import {
    createJob,
    listActiveJobs,
    updateJob,
    deleteJob
} from "../controllers/job.controller.ts";
import {
    applyForJob,
    listApplications,
    getApplication,
    updateApplication
} from "../controllers/applicant.controller.ts";

const router = new Router();

router
    // Job routes
    .post("/jobs", createJob)
    .get("/jobs", listActiveJobs)
    .put("/jobs/:jobId", updateJob)
    .delete("/jobs/:jobId", deleteJob)
    // Application routes
    .post("/applications", applyForJob)
    .get("/jobs/:jobId/applications", listApplications)
    .get("/applications/:applicationId", getApplication)
    .put("/applications/:applicationId", updateApplication);

export const jobRouter = router; 