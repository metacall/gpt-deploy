// import { faCab, faCopy, faExternalLinkAlt, faTerminal } from '@fortawesome/free-solid-svg-icons'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import React, { useEffect, useState } from 'react'
// import styles from './FunctionMini.module.scss'

// const colorSchema = {
//     "FILE": "grey",
//     "POST": "tomato",
//     "GET": 'cadetblue'
// }



// function FunctionMini({language, content,func,metadata, onClick}) {
//     let method = func.params.length > 0 ? "POST" : "GET";
//     if(language === "file")
//         method = "FILE";
    
//     let params_template={}
//     func.params.forEach((key)=>{params_template[key.name]= ""})
//     params_template = JSON.stringify(JSON.stringify(params_template));
//     const url = {

//         url : method === 'GET'
//                 ?`https://api.metacall.io/${metadata.prefix}/${metadata.suffix}/v1/call/${content}`
//                 : method === 'POST'
//                 ? `https://api.metacall.io/${metadata.prefix}/${metadata.suffix}/v1/call/${content}`
//                 : method === 'FILE'
//                 ? `https://api.metacall.io/${metadata.prefix}/${metadata.suffix}/v1/static/${content}`
//                 : "",
//         curl : method === 'GET'
//                 ?`curl -X GET "https://api.metacall.io/${metadata.prefix}/${metadata.suffix}/v1/call/${content}"` 
//                 : method === 'POST'
//                 ? `curl -X POST "https://api.metacall.io/${metadata.prefix}/${metadata.suffix}/v1/call/${content}" -H "Content-Type: application/json" -d ${params_template}`   
//                 : method === 'FILE'
//                 ? `curl "https://api.metacall.io/${metadata.prefix}/${metadata.suffix}/v1/static/${content}"`
//                 : "",
//     }

//     return (
//     <div 
//         className={styles.FunctionMini} 
//         onClick={onClick}
//         style= {{backgroundColor: colorSchema[method]}}
//         >
//             <div className={styles.miniContent}>
//                 {content}
//             </div>
//         <div className={styles.hoverUpMenu} 
//             onClick = {(event)=>{
//                 event.stopPropagation();
//             }}>
//             <FontAwesomeIcon icon={faCopy} title="copy" 
//             onClick={
//                 ()=>{
//                     navigator.clipboard.writeText( url.url);
//                 }
//             }/>
//             <FontAwesomeIcon icon={faTerminal} title="copy as curl"
//             onClick={
//                 ()=>{
//                     navigator.clipboard.writeText(url.curl);
//                 }
//             }
//             />
//             {
//                 method !== 'POST' &&
//                 <FontAwesomeIcon icon={faExternalLinkAlt} title="open" 
//                 onClick={
//                     ()=>{
//                         window.open(url.url, '_blank')
//                     }
//                 }
//                 />
//             }
//         </div>
        
//         <div className={styles.languageNameBox}>
//             {language}
//         </div>
//     </div>
//   )
// }

// export default FunctionMini


import { faCab, faCopy, faExternalLinkAlt, faTerminal } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import styles from './FunctionMini.module.scss'

const colorSchema = {
    "FILE": 'rgb(13, 17, 23)',
    "POST": 'rgb(13, 17, 23)',
    "GET": 'rgb(13, 17, 23)'
}


function FunctionMini({language, content,func,metadata, funcUrl, onClick}) {
    let method = func.params.length > 0 ? "POST" : "GET";
    if(language === "file")
        method = "FILE";
    
    let params_template={}
    func.params.forEach((key)=>{params_template[key.name]= ""})
    params_template = JSON.stringify(JSON.stringify(params_template));
    const url = {

        url : method === 'GET'
                ?`https://api.metacall.io/${metadata.prefix}/${metadata.suffix}/v1/call/${content}`
                : method === 'POST'
                ? `https://api.metacall.io/${metadata.prefix}/${metadata.suffix}/v1/call/${content}`
                : method === 'FILE'
                ? `https://api.metacall.io/${metadata.prefix}/${metadata.suffix}/v1/static/${content}`
                : "",
        curl : method === 'GET'
                ?`curl -X GET "https://api.metacall.io/${metadata.prefix}/${metadata.suffix}/v1/call/${content}"` 
                : method === 'POST'
                ? `curl -X POST "https://api.metacall.io/${metadata.prefix}/${metadata.suffix}/v1/call/${content}" -H "Content-Type: application/json" -d ${params_template}`   
                : method === 'FILE'
                ? `curl "https://api.metacall.io/${metadata.prefix}/${metadata.suffix}/v1/static/${content}"`
                : "",
    }

    return (
    <div 
        className={styles.FunctionMini} 
        onClick={onClick}
        style= {{backgroundColor: colorSchema[method]}}
        >
            <div className={styles.languageNameBox}>
                {language}
            </div>
            <div className={styles.miniContent}>
                {content}
            </div>
            <div className={styles.url}>
                {funcUrl}
            </div>
        <div className={styles.hoverUpMenu} 
            onClick = {(event)=>{
                event.stopPropagation();
            }}>
            <FontAwesomeIcon icon={faCopy} title="copy" 
            onClick={
                ()=>{
                    navigator.clipboard.writeText( url.url);
                }
            }/>
            <FontAwesomeIcon icon={faTerminal} title="copy as curl"
            onClick={
                ()=>{
                    navigator.clipboard.writeText(url.curl);
                }
            }
            />
            {
                method !== 'POST' &&
                <FontAwesomeIcon icon={faExternalLinkAlt} title="open" 
                onClick={
                    ()=>{
                        window.open(url.url, '_blank')
                    }
                }
                />
            }
        </div>
    </div>
  )
}

export default FunctionMini
