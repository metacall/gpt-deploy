import { faCloudDownloadAlt, faEraser, faRemove } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, {useState, useEffect, useRef , useLayoutEffect} from 'react'
import Confirm from '../../../../components/Confirm/Confirm';
import useFunctionCall from '../../../../customHooks/useCallFunction';
import FunctionMini from '../FunctionMini/FunctionMini'
import styles from './Deployment.module.scss'
function Deployment({ onClickFunction,className , funcData, funcUrl}) {

  const {call, data , isLoading , error} = useFunctionCall()
  const [showPrompt , setShowPrompt] = useState(false)
  const metadata = {
    prefix: funcData.prefix,
    suffix: funcData.suffix,
  }
  function countFiles(funcs){
    let count = 0;
    funcs.forEach(f=>{
      if(f.lang === 'file'){
        count++;
      }
    })
    return count;
  }
  return (
    <React.Fragment>
      <div className={styles.DeploymentCover}>
        <div className = {styles.headMenu}>
            <div className={styles.skewed}>
            </div>
            <div className={styles.headTools}>
              <FontAwesomeIcon icon = {faEraser} className={styles.removePackage} 
              title = "undeploy" 
              onClick={()=>{
                setShowPrompt({
                  message: `Are you sure you want to undeploy ${funcData.suffix}?`,
                  onOk: ()=>{
                    call({
                      url: '/api/undeploy',
                      method: 'POST',
                      data: {
                        prefix: funcData.prefix,
                        suffix: funcData.suffix,
                      }
                    },{
                      onSuccess: (data)=>{
                        window.location.reload();
                        alert(data.message)
                      },
                      onError: (error)=>{
                        console.log(error);
                        alert("Error occured")
                      }
                    })
                  },
                  onCancel: ()=>{},
                })
              }}
              />
            </div>
        </div>
        <div className={styles.body}>
        <div className={styles.DeploymentTitle}>
          <div className={styles.logo}>
            <img src={'./logo.png'} alt="logo" height="50px" />
          </div>
          <div className={styles.packageName}>
            {funcData.suffix}
          </div>
          <div className={styles.rightHead}>
            <div>
                {funcData.functions.length || "No"} functions
            </div>
            <div>
              {countFiles(funcData.functions) || "No"} files
            </div>
          </div>
        </div>
        <div className={styles.Deployment+" "+ className}>
            { funcData.functions.length > 0 
              ? funcData.functions.map((f,index)=><FunctionMini 
                  language={f.lang} 
                  content = {f.name} 
                  func = {f} 
                  metadata  = {metadata}
                  onClick={()=>onClickFunction(index)}
                  /> )
              : <div className={styles.noFunctions}>
                  No functions found
                </div>
            }
        </div>
        </div>
      </div>
      <Confirm showPrompt={showPrompt} setShowPrompt={setShowPrompt} />
    </React.Fragment>
  )
}

export default Deployment
