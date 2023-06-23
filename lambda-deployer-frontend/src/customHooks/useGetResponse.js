import { useMutation } from "react-query"
import {getAsker} from "../backend_logic/controller/function_generator"

export default function useGetResponse(openAIKey){
    const asker = getAsker(openAIKey)
    async function query(prompt){
            return await asker(prompt)
    }
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