import React from 'react'
import styles from './Bottom.module.scss'
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faCopy } from '@fortawesome/free-solid-svg-icons';
function Bottom({title= 'Output', content="", setContent,errorFlag =false,setErrorFlag, isJson=false}) {
    const contentRef = React.useRef(null);
    React.useEffect(()=>{
        let json= content;
        if(errorFlag)
            contentRef.current.innerHTML = `<span style="color:red">${content}</span>`
        else
        if(isJson){
            if(typeof (content) === "object")
                json = JSON.stringify(content, null, 2);
            contentRef.current.innerHTML = highlight(json , languages.js, 'js') 
        } else {
            contentRef.current.innerHTML = content;
        }
    },[content, errorFlag, isJson])

  return (
    <div className={styles.Bottom}>
        <div className={styles.header} style={{backgroundColor: errorFlag?"red": ""}}>
            <span>
                {title}
            </span>

            <div className={styles.outputTools}>
                <FontAwesomeIcon icon={faClose} className={styles.closeIcon}  title={"open in new tab"}
                            onClick={
                                ()=>{
                                    setContent("");
                                    setErrorFlag(false);
                                }
                            }
                        />
                <FontAwesomeIcon icon={faCopy} className={styles.copy} title={"copy content"}
                        onClick={
                            ()=>{
                                if(contentRef.current.innerText)
                                    navigator.clipboard.writeText(contentRef.current.innerText);
                            }
                        }
                    />
            </div>
        </div>
        <div></div>
        <div className={styles.bottomContainer} ref= {contentRef}>
        </div>
    </div>
  )
}

export default Bottom
