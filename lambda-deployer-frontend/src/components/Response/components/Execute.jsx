import React, { useEffect,useState } from "react";
import styles from './Execute.module.scss'

export default function Execute({func,params}){
    const [parameters, setParameters] = useState(new Array(params?.length??0).fill(''))
    const [output, setOutput] = useState('')

    function createTypedParameter(parameter){
        const typed_parameter = []
        for(let i=0;i<parameter.length;i++){
            const p = parameter[i];
            const type = params[i][1];
            try{
                switch(type.toLowerCase()){
                    case 'int':
                        typed_parameter.push(parseInt(p))
                        break;
                    case 'float':
                        typed_parameter.push(parseFloat(p))
                        break;
                    case 'boolean':
                        typed_parameter.push(p.toLowerCase()==='true')
                        break;
                    case 'list': 
                        typed_parameter.push(JSON.parse(p))
                        break;
                    case 'object':
                        typed_parameter.push(JSON.parse(p))
                    default:
                        typed_parameter.push(p)
                }
                
            } catch(e){
                return "error"
            }

        }
        return typed_parameter
    }

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
                <button className={styles.executeButton} onClick={()=>{
                    const typed_parameter = createTypedParameter(parameters)
                    let result = func.apply(this,typed_parameter)
                    setOutput(result)
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