import { Router } from "https://deno.land/x/oak/mod.ts";
import {
    createInterviewHandler,
    getInterviewWithAnalysisHandler
} from "../controllers/interview.controller.ts";
import {
    createAnalysis,
    getAnalysis
} from "../controllers/analysis.controller.ts";

const router = new Router();

router
    // Interview routes
    .post("/interviews", createInterviewHandler)
    .get("/interviews/:interviewId", getInterviewWithAnalysisHandler)
    // Analysis routes
    .post("/analysis", createAnalysis)
    .get("/analysis/:analysisId", getAnalysis);

export const interviewRouter = router; 