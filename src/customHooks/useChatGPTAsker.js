import { useMutation } from "react-query"
import {useRef} from "react"
import { getAsker, generateFunctionMetadata } from "../backend_logic/controller/function_generator"
import { useSelector } from "react-redux"
import { getModel, tableEnum } from "../models";

export default function useChatGPTAsker(openAIKey, model, language){
    const {stashedKeys} = useSelector(state=>state.stashes)
    const keyValueDB = useRef(getModel(tableEnum.RESPONSES));

    const asker = getAsker(openAIKey, model, language)
    async function query(prompt){
        async function getResponses() {
            const responses = await Promise.all(
              stashedKeys.map(async (key) => {
                const response = await keyValueDB.current.get(key);
                return response;
              })
            );
            return responses;
        }
        const responses = await getResponses();
        const functionMetadata = generateFunctionMetadata(responses);
        return await asker(prompt, functionMetadata)
    }
    const {mutate:ask, data,isLoading, error, isError} = useMutation(query,{
        retry: 0,
        onError: (error) => {
            console.error(error)
        }
    })
    return {
            ask, 
            data, 
            isLoading, 
            error,
            isError
        }
}