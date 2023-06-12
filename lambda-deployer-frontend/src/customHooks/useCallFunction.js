import { useMutation } from "react-query"
import axios from "../backend_logic/utils/faxios"
async function query(postData){
    let response = null;
    if(postData.method === 'POST'){
        response= await axios.post(postData.url,{
            ...postData.data
        })
        const statusCode = response.response.status
        if(!(statusCode < 400 && statusCode >= 200)){
            throw new Error("Error with status code: " + statusCode)
        }
        return response.data
    } else  if(postData.method === 'GET'){
        response= await axios.get(postData.url)
        const statusCode = response.response.status
        if(!(statusCode < 400 && statusCode >= 200)){
            throw new Error("Error with status code: " + statusCode)
        }
        return response.data
    } else if(postData.method === 'DELETE'){
        response= await axios.post(postData.url,{
            ...postData.data
        })
        const statusCode = response.response.status
        if(!(statusCode < 400 && statusCode >= 200)){
            throw new Error("Error with status code: " + statusCode)
        }
        return response.data
    }
    else throw Error("Invalid method type")
}

export default function useFunctionCall(){
    const {mutate:call, data,status,isLoading, error} = useMutation(query,{
        retry: 0,
        onError: (error) => {
            console.error(error)
        }
    })
    return {
            call, 
            data, 
            isLoading, 
            error
        }
}