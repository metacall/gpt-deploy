function getReqRes(req, cb_resp, cb_status) {
    const res = {
        json: (data) => {
           cb_status(201)
           cb_resp(data);
        },
        send: (data) => {
            cb_status(200)
            cb_resp(data);
        },
        status: (code) => {
            cb_status(code)
            return res;
        }
    }
    return {req, res}
}

export const callController = async (controller, request) => {
    let statusCode, response;
    response = await new Promise(async (cb_resp) =>{
        statusCode = await new Promise((cb_status) => {
            const {req, res} = getReqRes(request, cb_resp, cb_status)
            controller(req, res)
        })
    })
    if(!(statusCode < 400 && statusCode >= 200)){
        throw new Error(JSON.stringify({
            statusCode,
            message: 'Error with status code: ' + statusCode
        }))
    }
    return response
}
