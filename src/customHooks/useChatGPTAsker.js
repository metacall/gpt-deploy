import { useMutation } from "react-query"
import { getAsker } from "../backend_logic/controller/function_generator"

export default function useChatGPTAsker(openAIKey, model, language){
    const asker = getAsker(openAIKey, model, language)
    async function query(prompt){
        return await asker(prompt)
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