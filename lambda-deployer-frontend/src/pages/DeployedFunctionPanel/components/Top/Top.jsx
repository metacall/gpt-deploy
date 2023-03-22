import { faCircle, faCopy, faExternalLinkAlt, faPlay, faPlayCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import React, { useEffect, useState } from 'react'
import FieldInput from '../FieldInput/FieldInput'
import styles from './Top.module.scss'
function Top({ funcUrl , fields , setFields , method, onCall, loading}) {

    const changeField = (index,text)=>{
        let temp = [...fields];
        temp[index][2] = text;
        setFields(temp);
    }

    return (
    <div className={styles.Top}>
        <div className={styles.mainContent}>
            <div className={styles.urlWrapper}>
                <span className={styles.method} style={{backgroundColor: method=== 'GET'?"#2c7a8e": 'tomato'}}>
                    {method}
                </span>
                <span className={styles.url}>
                    {funcUrl} 
                </span>
                <div className={styles.toolBox}>
                    {
                        method === 'GET' &&
                        <FontAwesomeIcon icon={faExternalLinkAlt} className={styles.copy} title={"open in new tab"}
                            onClick={
                                ()=>{
                                    window.open(funcUrl, '_blank');
                                }
                            }
                        />
                    }
                    <FontAwesomeIcon icon={faCopy} className={styles.copy} title={"copy url"}
                        onClick={
                            ()=>{
                                navigator.clipboard.writeText(funcUrl);
                            }
                        }
                    />
                </div>
                <FontAwesomeIcon icon={faPlay} className={classNames(styles.run, {[styles.running]: loading})} title={"run function"} 
                    onClick={(e)=>{
                                if(!loading)
                                    onCall()
                            }
                        }/>
            </div>
            {
            method=== "POST" &&
                fields.map((field, index)=>{
                    return <FieldInput
                            key={index}
                            inputValue={field[2]}
                            setInputValue={(text)=>{changeField(index , text)}}
                            fieldType={field[1]}F
                            fieldName={field[0]}
                        />
                })
            }
        </div>
    </div>
    )
}

export default Top
