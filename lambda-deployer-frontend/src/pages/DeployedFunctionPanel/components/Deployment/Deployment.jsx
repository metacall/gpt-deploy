import React, { useEffect, useRef , useLayoutEffect} from 'react'
import FunctionMini from '../FunctionMini/FunctionMini'
import styles from './Deployment.module.scss'
function Deployment({ onClickFunction,className , funcData, funcUrl}) {
  const metadata = {
    prefix: funcData.prefix,
    suffix: funcData.suffix,
  }
  function countFiles(funcs){
    let count = 0;
    console.log(funcs)
    funcs.forEach(f=>{
      if(f.lang === 'file'){
        count++;
      }
    })
    return count;
  }
  return (
    <div className={styles.DeploymentCover}>
      <div className={styles.DeploymentTitle}>
        <div className={styles.logo}>
          <img src={'./logo.png'} alt="logo" height="50px" />
        </div>
        <div className={styles.packageName}>
          {funcData.suffix}
        </div>
        <div className={styles.rightHead}>
          <div>
              {funcData.functions.length} functions
            </div>
            <div>
              {countFiles(funcData.functions)} files
            </div>
        </div>
      </div>
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
    </div>
  )
}

export default Deployment
