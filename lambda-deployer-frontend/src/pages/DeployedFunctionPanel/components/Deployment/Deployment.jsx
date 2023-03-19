import React, { useEffect, useRef , useLayoutEffect} from 'react'
import FunctionMini from '../FunctionMini/FunctionMini'
import styles from './Deployment.module.scss'
function Deployment({ onClickFunction,className , funcData, pkg}) {
  console.log(funcData, "*********")
  const metadata = {
    prefix: funcData.prefix,
    suffix: funcData.suffix,
  }
  return (
    <div className={styles.Deployment+" "+ className}>
        {
          funcData.functions.map((f,index)=><FunctionMini 
              language={f.lang} 
              content = {f.name} 
              func = {f} 
              metadata  = {metadata}
              onClick={()=>onClickFunction(index)}
              
              /> )
        }
    </div>
  )
}

export default Deployment
