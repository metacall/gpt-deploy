import {callController} from './apiInterface.js';
import router from '../proxyAPI/app.js';
import pathToRegex from 'path-to-regexp';

const routes = router.routes;
const getController = async (url) => {
    const [path , queryString ] = url.split('?');
    for(let route in routes){
        const keys = [];
        const regex = pathToRegex(route, keys);
        const match = regex.exec(path);
        if (match) {
            const params = {};
            keys.forEach((key, index) => {
                params[key.name] = match[index + 1];
                return {
                    controller: routes[route],
                    params
                }
            });

            // Get all query parameters
            const queryParams = new URLSearchParams(queryString);
            const query={}
            for (const [key, value] of queryParams.entries()) {
                query[key] = value;
            }

            return {
                controller: routes[route],
                query,
                params
            }
        }
    }

    throw new Error('No route found for path: ' + path)
}

const _caller =  async (path, body) => {
    console.info('Calling url: ' + path, body)
    let response = null;
    try{
        const {controller, query, params} = await getController(path);
        const request = {
            body,
            query,
            params
        }
        const data = await callController(controller, request);
        response = {
            data,
            response: {
                status: 200,
                message: 'Ok'
            }
        };
    } catch(e){
        e = JSON.parse(e.message)
        response = {
            error: e.message,
            response: {
                status: e.statusCode,
                message: e.message
            }
        }
    } finally{
        console.info('Response for url: ' + response)
        return response;
    }
}

const faxios = {}

const methods= ['get', 'post', 'put', 'delete'];
methods.forEach(method => {
    faxios[method] = _caller
})

export default faxios;



