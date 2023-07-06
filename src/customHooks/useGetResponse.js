import { useMutation } from "react-query"
import { getAsker } from "../backend_logic/controller/function_generator"

export default function useGetResponse(openAIKey, model){
    const asker = getAsker(openAIKey, model)
    async function query(body){
        const {prompt, model ='text-davinci-003'} = body
            return await asker(prompt, model)
    }
    const {mutate:ask, data,isLoading, error} = useMutation(query,{
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