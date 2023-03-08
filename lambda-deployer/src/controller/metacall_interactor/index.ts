import { Request, Response } from "express";
(await import("dotenv")).config();
import protocolAPI, { API, ResourceType } from "../../protocol/protocol.js";
import { Create, Deployment, MetaCallJSON } from "../../protocol/deployment.js";
import { Plans } from "../../protocol/plan.js";


export const createPackage = async (req: Request, res: Response) => {
    try {
        const blob = req.file as unknown;
        const jsons = req.body.jsons as MetaCallJSON[];
        const runners = req.body.runners as string[];
        const name = req.body.name as string;
        // console.log({
        //     blob,
        //     jsons,
        //     runners,
        //     name
        // })
        // const token = req.session.token //TODO: add token to session
        const token = process.env.METACALL_TOKEN as string;
        const metacallAPI: API = protocolAPI(token , process.env.METACALL_URL as string);
        const response_data: string = await metacallAPI.upload(name , blob, jsons , runners);
        res.json({
            message: "package created successfully",
            response_data
        });
    } catch(err : unknown) {
        const error = err as Error;
        console.log(error.message);
        res.status(500).json({
            message: "failed to create package"
        })
    }

}

export const deploy = async (req: Request, res: Response) => {
    try {
        const name = req.body.name as string;
        const env = req.body.env as Array<{name: string , value : string}>;
        const plan: Plans = Plans.Essential;
        const resourceType = "Package" as ResourceType;
        // const token = req.session.token //TODO: add token to session
        const token = process.env.METACALL_TOKEN as string;
        const metacallAPI: API = protocolAPI(token , process.env.METACALL_URL as string);
        const create_data: Create = await metacallAPI.deploy(name , env , plan , resourceType);
        res.json({
            message: "deployed successfully",
            create_data
        });
    } catch(err : unknown) {
        const error = err as Error;
        console.log(error.message);
        res.status(500).json({
            message: "failed to create package"
        })
    }
}

export const undeploy = async (req: Request, res: Response) => {
    try {
        const prefix = req.body.prefix as string;
        const suffix = req.body.suffix as string;
        const version = req.body.version as string ?? "v1";
        // const token = req.session.token //TODO: add token to session
        const token = process.env.METACALL_TOKEN as string;
        const metacallAPI: API  = protocolAPI(token , process.env.METACALL_URL as string);
        const create_data: string = await metacallAPI.deployDelete(prefix, suffix, version);
        res.json({
            message: "undeployed successfully",
            create_data
        });
    } catch(err : unknown) {
        const error = err as Error;
        console.log(error.message);
        res.status(500).json({
            message: "failed to create package"
        })
    }
}

export const getDeployments = async (req: Request, res: Response) => {
    try{
        // const token = req.session.token //TODO: add token to session
        const token = process.env.METACALL_TOKEN as string;
        const metacallAPI: API  = protocolAPI(token , process.env.METACALL_URL as string);
        const deployments : Deployment[] = await metacallAPI.inspect();
        return res.json(deployments);
    } catch (err : unknown){
        const error = err as Error;
        console.log(error.message);
        res.status(500).json({
            message: "failed to get deployments"
        })
    }
}