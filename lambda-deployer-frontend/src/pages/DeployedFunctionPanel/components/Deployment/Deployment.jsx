import React, { useEffect, useRef , useLayoutEffect} from 'react'
import FunctionMini from '../FunctionMini/FunctionMini'
import styles from './Deployment.module.scss'
function Deployment({ onClickFunction,className}) {

  return (
    <div className={styles.Deployment+" "+ className}>
          {
            new Array(3).fill(0).map((_,index)=><FunctionMini language={"NodeJS"} content = {index} onClick={()=>onClickFunction(index)}/> )
          }
    </div>
  )
}

export default Deployment
