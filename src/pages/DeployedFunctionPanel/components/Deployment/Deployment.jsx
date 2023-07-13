import {  faEraser, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, {useState, useContext} from 'react'
import Confirm from '../../../../components/Confirm/Confirm';
import FunctionMini from '../FunctionMini/FunctionMini'
import styles from './Deployment.module.scss'
import logo from './logo.png'
import {useSelector} from 'react-redux'
import { MessageContext } from '../../../../components/MessageStack/MessageStack';
import protocol from '@metacall/protocol/protocol'
import { metacallBaseUrl } from '../../../../constants/env';
function Deployment({ onClickFunction,className , funcData, afterRemove}) {
  const {
    METACALL_TOKEN: metacallToken
  } = useSelector(state=> state.env)
  const metacallAPI = protocol(metacallToken, metacallBaseUrl)
  const [removingPackage , setRemovingPackage] = useState(false)
  const [showPrompt , setShowPrompt] = useState(false)
  const metadata = {
    prefix: funcData.prefix,
    suffix: funcData.suffix,
  }
  const {addSuccess, addError} = useContext(MessageContext)
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
              <FontAwesomeIcon icon = { removingPackage? faSpinner :faEraser} className={ removingPackage? 'animate-spin ':''+styles.removePackage} 
              title = "undeploy" 
              onClick={()=>{
                setShowPrompt({
                  message: `Are you sure you want to undeploy ${funcData.suffix}?`,
                  onOk: ()=>{
                    setRemovingPackage(true)
                    metacallAPI.deployDelete(
                      funcData.prefix, 
                      funcData.suffix
                    ).then(()=>{
                      setRemovingPackage(false)
                      afterRemove()
                      addSuccess( "Undeploying successfully")
                    }).catch((error)=>{
                      setRemovingPackage(false)
                      addError(error?.message ?? error?.response?.data?.message ?? "Undeploying failed")
                    })
                  },
                  onCancel: ()=>{},
                })
              }}
              disabled = {removingPackage}
              />
            </div>
        </div>
        <div className={styles.body}>
        <div className={styles.DeploymentTitle}>
          <div className='overflow-hidden h-full' >
            <img src={logo} alt="logo" height="100%" className='h-full'/>
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
                  key = {index}
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
