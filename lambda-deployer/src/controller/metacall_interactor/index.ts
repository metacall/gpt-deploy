import { Request, Response } from "express";
(await import("dotenv")).config();
import logger from "../../logger/index.js";
import fs from 'fs';
import axios from 'axios';
import protocolAPI, { API, ResourceType } from "../../protocol/protocol.js";
import { Create, Deployment, MetaCallJSON } from "../../protocol/deployment.js";
import { Plans } from "../../protocol/plan.js";
import FormData from "form-data";


export const createPackage = async (req: Request, res: Response) => {
    try {
        const blob = req.file as any;
        const jsons = req.body.jsons as MetaCallJSON[];
        const runners = req.body.runners as string[];
        const name = req.body.id as string;
        const type = req.body.type as string;
        // logger.info(name);
        // logger.info({
        //     blob,
        //     jsons,
        //     runners,
        //     name
        // })
        // const token = req.session.token //TODO: add token to session
        // logger.info(blob);
        // fs.writeFileSync("test.zip", blob.buffer,{
        //     encoding: "binary"
        // });
        const token = process.env.METACALL_TOKEN as string;
        const fd=  new FormData();
        const metacallAPI: API = protocolAPI(token , process.env.METACALL_FAAS_BASE_URL as string);
        const response_data: string = await metacallAPI.upload(name , blob.buffer, jsons , runners, type);
        res.json({
            message: "package created successfully",
            response_data
        });
    } catch(err : unknown) {
        const error = err as Error;
        logger.error(error);
        res.status(500).json({
            message: "failed to create package"
        })
    }
}

export const deploy = async (req: Request, res: Response) => {
    try {
        const name = req.body.name as string;
        // const env = req.body.env as Array<{name: string , value : string}> ?? [];
        const env = [] as {name: string , value : string}[];
        const plan: Plans = Plans.Standard;
        const resourceType = "Package" as ResourceType;
        // const token = req.session.token //TODO: add token to session
        const token = process.env.METACALL_TOKEN as string;
        const metacallAPI: API = protocolAPI(token , process.env.METACALL_FAAS_BASE_URL as string);
        logger.info(name);
        const create_data: Create = await metacallAPI.deploy(name , env , plan , resourceType);
        res.json({
            message: "deployed successfully",
            create_data
        });
    } catch(err : unknown) {
        const error = err as Error;
        logger.error(error);
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
        const metacallAPI: API  = protocolAPI(token , process.env.METACALL_FAAS_BASE_URL as string);
        const create_data: string = await metacallAPI.deployDelete(prefix, suffix, version);
        res.json({
            message: "undeployed successfully",
            create_data
        });
    } catch(err : unknown) {
        const error = err as Error;
        logger.error(error.message);
        res.status(500).json({
            message: "failed to create package"
        })
    }
}

export const getDeployments = async (req: Request, res: Response) => {
    try{
        // const token = req.session.token //TODO: add token to session
        const token = process.env.METACALL_TOKEN as string;
        const metacallAPI: API  = protocolAPI(token , process.env.METACALL_FAAS_BASE_URL as string);
        const deployments : Deployment[] = await metacallAPI.inspect();
        return res.json(deployments);
    } catch (err : unknown){
        const error = err as Error;
        logger.error(error.message);
        res.status(500).json({
            message: "failed to get deployments"
        })
    }
}