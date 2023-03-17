import { faCab, faCopy, faExternalLinkAlt, faTerminal } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import styles from './FunctionMini.module.scss'
function FunctionMini({language, content, onClick}) {
  return (
    <div className={styles.FunctionMini} onClick={onClick}>
            <div className={styles.miniContent}>
                {content}
            </div>
        <div className={styles.hoverUpMenu} 
            onClick = {(event)=>{
                event.stopPropagation();
            }}>
            <FontAwesomeIcon icon={faCopy} title="copy"/>
            <FontAwesomeIcon icon={faTerminal} title="copy as curl"/>
            <FontAwesomeIcon icon={faExternalLinkAlt} title="open"/>
        </div>
        
        <div className={styles.languageNameBox}>
            {language}
        </div>
    </div>
  )
}

export default FunctionMini
