import { useQuery } from "react-query"
import protocol from '@metacall/protocol/protocol'
import { metacallBaseUrl } from "../constants/env"
export default function usePLansAvailable(metacallToken){
    async function query(){
        const metacallAPI = protocol(metacallToken, metacallBaseUrl)
        const plans = await metacallAPI.listSubscriptions()
        return Object.keys(plans)
    }
    const {data,isLoading, status, error, refetch, isRefetching} = useQuery("getAllPlans",query,{
        retry: 0,
        onError: (error) => {
            console.error(error)
        }
    })
    return {
            data, 
            isLoading, 
            error,
            status,
            refetch,
            isRefetching
        }
}