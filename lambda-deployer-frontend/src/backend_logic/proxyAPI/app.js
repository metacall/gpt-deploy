import router from "./router.js";
import { ask, createPackage, deploy, undeploy, getDeployments, getStaticFile } from "../controller/index.js";
router.post("/api/ask", ask);
router.post("/api/create", createPackage);
router.post("/api/deploy", deploy);
router.get("/api/getDeployments", getDeployments);
router.get("/api/getStaticFile/:prefix/:suffix/:filename", getStaticFile)
router.post("/api/undeploy", undeploy)

export default router;