import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Func from '../../components/Func/Func';
import styles from './DeployedFunctionPanel.module.scss'
function DeployedFunctionPanel() {
    const [funcs , setFuncs] = useState([]);
    useEffect(() => {
    axios.get("/api/getDeployments").then(res=>res.data).then(data=>{
        data= data?.[0]?.packages?.node?.[0]?.scope?.funcs;
        console.log(data)
        if(!data)
            setFuncs([])
        else
            setFuncs(data)
    }).catch(console.error)
    },[])
    return (
        <div className={styles.DeployedFunctionPanel}>
            {
                funcs.map(({name,signature})=>
                    <Func func_name={name} params={signature.args.map(({name})=>[name, "string"])}/>
                )    
            }
        </div>
    )
}

export default DeployedFunctionPanel
