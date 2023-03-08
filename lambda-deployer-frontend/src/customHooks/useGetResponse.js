import { useMutation } from "react-query"
import axios from "axios"
import { useEffect } from "react"
async function query(prompt){
        let response= await axios.post('/api/ask',{
            prompt
        }).then(res=>res.data)
        return response
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