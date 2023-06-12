import { useMutation } from "react-query"
import axios from "../backend_logic/utils/faxios"
import { useEffect } from "react"
async function query(prompt){
        let response= await axios.post('/api/ask',{
            prompt
        })

        const statusCode = response.response.status
        if(!(statusCode < 400 && statusCode >= 200)){
            throw new Error("Error with status code: " + statusCode)
        }
        return response.data
}

export default function useGetResponse(){
    const {mutate:ask, data,status,isLoading, error} = useMutation(query,{
        retry: 0,
        onError: (error) => {
            console.error(error)
        }
    })
    return {
            ask, 
            data, 
            isLoading, 
            error
        }
}