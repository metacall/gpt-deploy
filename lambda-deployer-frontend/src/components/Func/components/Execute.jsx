import axios from "axios";
import React, { useEffect,useState } from "react";
import styles from './Execute.module.scss'

export default function Execute({func,params}){
    const [parameters, setParameters] = useState(new Array(params?.length??0).fill(''))
    const [output, setOutput] = useState('')


    function getTypedOutput(output){
        if(typeof output === 'object'){
            return JSON.stringify(output)
        }
        return output   
    }

    return (
        <div className={styles.Execute}>
            <div className={styles.paramsWrapper}>
                <span className={styles.inputTitle}>Input Parameters:</span>
                <div className={styles.line}></div>
                {   
                    params.map(([p,type],ind)=>(
                        <div key={ind} className={styles.parameter}>
                            <input 
                            type="text" 
                            value={parameters[ind]} 
                            placeholder={`${p}:(${type})`}
                            onChange={(e)=>setParameters(prev=>{
                                return prev.map((p,i)=>i===ind?e.target.value:p)
                            })}
                            />
                        </div>
                    ))
                }
                <button className={styles.executeButton} onClick={async()=>{
                    if(!localStorage.getItem("suffix"))
                        alert("please deploy functions first");
                    else  {
                        let result = await axios.post(`/${localStorage.getItem("suffix")}/js/v1/call/`+func,parameters).then(data=>data.data).catch(console.error)
                        setOutput(result)
                    }
                }}>
                        Execute
                </button>
            </div>
            <div className={styles.output}>
                <span className={styles.outputTitle}>Output:</span>
                <div className={styles.line}></div>

                <div className={styles.result}>
                    <pre>
                        {getTypedOutput(output)}
                    </pre>
                </div>
            </div>
        </div>
    )
}