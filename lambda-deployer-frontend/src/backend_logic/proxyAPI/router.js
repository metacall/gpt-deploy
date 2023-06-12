import { ask , createPackage, deploy , undeploy ,getDeployments, getStaticFile} from "../controller/index.js";

const routesMap = {
}
export default {
    get: async (path, controller) => {
        routesMap[path] = controller;
    },
    post: async (path, controller) => {
        routesMap[path] = controller;
    },
    put: async (path, controller) => {
        routesMap[path] = controller;
    },
    delete: async (path, controller) => {
        routesMap[path] = controller;
    },
    get routes(){
        return routesMap
    }
}
