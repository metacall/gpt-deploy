import { useMutation } from "react-query"
import protocol from '@metacall/protocol/protocol'
import { metacallBaseUrl } from "../constants/env"
export default function useInspect(metacallToken){
    async function query(){
        try{
            const metacallAPI = protocol(metacallToken, metacallBaseUrl)
        const deployments = await metacallAPI.inspect().then(data=>{
            const langs = ['node', 'py', 'file']
            const packagesData = data.map(({packages, ...rest})=>{
                const collection = []
                for(let lang of langs){
                    if(!packages[lang]) continue;
    
                    for(let pkg of packages[lang]){
                        const funcs  = pkg.scope.funcs;
                        for(let func of funcs){
                            const func_metadata = {
                                lang ,
                                name: func.name,
                                params: func.signature.args,
                                return_type: func.signature.ret.type,
                            }
                            collection.push(func_metadata)
                        }
                    }
                }
                return {
                    functions: collection ,
                    ...rest
                };
            })
            return packagesData
        }
        )
        return deployments;
        } catch(err){
            console.error(err)
            throw err
        }
    }
    const {mutate:inspect, data,isLoading, error} = useMutation(query,{
        retry: 0,
        onError: (error) => {
            console.error(error)
        }
    })
    return {
            inspect, 
            data, 
            isLoading, 
            error
        }
}