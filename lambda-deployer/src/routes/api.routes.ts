import express from "express";
import { ask , createPackage, deploy , undeploy ,getDeployments, getStaticFile} from "../controller/index.js";
export const router = express.Router();
import multer,{memoryStorage} from "multer";
const upload = multer({ storage: memoryStorage() });
router.use(express.json());
router.post("/ask", ask);
router.post("/create", upload.single('raw')  ,createPackage);
router.post("/deploy", deploy);
router.get("/getDeployments", getDeployments);
router.get("/getStaticFile/:prefix/:suffix/:filename", getStaticFile)
router.post("/undeploy", undeploy)
