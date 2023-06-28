/*

* About File:

    this is just a client that implements all the rest API from the FaaS, so each function it contains is an endpoint in the FaaS for deploying and similar

    refresh: updates the auth token
    validate: validates the auth token
    deployEnabled: checks if you're able to deploy
    listSubscriptions: gives you a list of the subscription available
    listSubscriptionsDeploys: gives you a list of the subscription being used in deploys
    inspect: gives you are deploys with it's endpoints
    upload: uploads a zip (package) into the faas
    deploy: deploys the previously uploaded zip into the faas
    deployDelete: deletes the deploy and the zip
    logs: retrieve the logs of a deploy by runner or deployment
    branchList: get the branches of a repository
    fileList: get files of a repository by branch
    */
import axios from 'axios';
import FormData from 'form-data';
import { LogType } from './deployment.js';
export const isProtocolError = (err) => axios.isAxiosError(err);
export default (token, baseURL) => {
    const api = {
        refresh: () => axios
            .get(baseURL + '/api/account/refresh-token', {
            headers: { Authorization: 'jwt ' + token }
        })
            .then(res => res.data),
        validate: () => axios
            .get(baseURL + '/validate', {
            headers: { Authorization: 'jwt ' + token }
        })
            .then(res => res.data),
        deployEnabled: () => axios
            .get(baseURL + '/api/account/deploy-enabled', {
            headers: { Authorization: 'jwt ' + token }
        })
            .then(res => res.data),
        listSubscriptions: async () => {
            const res = await axios.get(baseURL + '/api/billing/list-subscriptions', {
                headers: { Authorization: 'jwt ' + token }
            });
            const subscriptions = {};
            for (const id of res.data) {
                if (subscriptions[id] === undefined) {
                    subscriptions[id] = 1;
                }
                else {
                    ++subscriptions[id];
                }
            }
            return subscriptions;
        },
        listSubscriptionsDeploys: async () => axios
            .get(baseURL + '/api/billing/list-subscriptions-deploys', {
            headers: { Authorization: 'jwt ' + token }
        })
            .then(res => res.data),
        inspect: async () => axios
            .get(baseURL + '/api/inspect', {
            headers: { Authorization: 'jwt ' + token }
        })
            .then(res => res.data),
        upload: async (name, blob, jsons = [], runners = [], type = 'application/x-zip-compressed') => {
            const fd = new FormData();
            fd.append('id', name);
            fd.append('type', type);
            fd.append('jsons', JSON.stringify(jsons));
            fd.append('runners', JSON.stringify(runners));
            fd.append('raw', blob, {
                filename: 'blob',
                contentType: type
            });
            const res = await axios.post(baseURL + '/api/package/create', fd, {
                headers: {
                    Authorization: 'jwt ' + token,
                    'Content-Type': 'multipart/form-data',
                    ...(fd.getHeaders?.() ?? {})
                }
            });
            return res?.data;
        },
        add: (url, branch, jsons = []) => axios
            .post(baseURL + '/api/repository/add', {
            url,
            branch,
            jsons
        }, {
            headers: { Authorization: 'jwt ' + token }
        })
            .then((res) => res.data),
        branchList: (url) => axios
            .post(baseURL + '/api/repository/branchlist', {
            url
        }, {
            headers: { Authorization: 'jwt ' + token }
        })
            .then((res) => res.data),
        deploy: (name, env, plan, resourceType, release = Date.now().toString(16), version = 'v1') => {
            return axios
                .post(baseURL + '/api/deploy/create', {
                resourceType,
                suffix: name,
                env,
                plan,
                version
            }, {
                headers: { Authorization: 'jwt ' + token }
            })
                .then(res => res.data);
        },
        deployDelete: (prefix, suffix, version = 'v1') => axios
            .post(baseURL + '/api/deploy/delete', {
            prefix,
            suffix,
            version
        }, {
            headers: { Authorization: 'jwt ' + token }
        })
            .then(res => res.data),
        logs: (container, type = LogType.Deploy, suffix, prefix, version = 'v1') => axios
            .post(baseURL + '/api/deploy/logs', {
            container,
            type,
            suffix,
            prefix,
            version
        }, {
            headers: { Authorization: 'jwt ' + token }
        })
            .then(res => res.data),
        fileList: (url, branch) => axios
            .post(baseURL + '/api/repository/filelist', {
            url,
            branch
        }, {
            headers: { Authorization: 'jwt ' + token }
        })
            .then(res => res.data['files'])
    };
    return api;
};
//# sourceMappingURL=protocol.js.map