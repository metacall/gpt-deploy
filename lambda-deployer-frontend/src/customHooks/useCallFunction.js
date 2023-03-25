import { useMutation } from "react-query"
import axios from "axios"
async function query(postData){
    let response = null;
    if(postData.method === 'POST'){
        response= await axios.post(postData.url,{
            ...postData.data
        }).then(res=>res.data)
        return response
    } else  if(postData.method === 'GET'){
        response= await axios.get(postData.url).then(res=>res.data)
        return response
    } else if(postData.method === 'DELETE'){
        response= await axios.post(postData.url,{
            ...postData.data
        }).then(res=>res.data)
        return response 
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