import { useMutation } from "react-query"
import axios from "axios"

async function query(prompt){
    const deployments = await axios.get("/api/getDeployments").then(res=>res.data).then(data=>{
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
}

export default function useInspect(){
    const {mutate:inspect, data,status,isLoading, error} = useMutation(query,{
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