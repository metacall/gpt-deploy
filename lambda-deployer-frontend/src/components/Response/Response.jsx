import React,{ useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faMicrochip, faRefresh } from '@fortawesome/free-solid-svg-icons'
import { faCopy, faTimesCircle } from '@fortawesome/free-regular-svg-icons'
import useGetResponse from '../../customHooks/useGetResponse'
import {getModel, tableEnum} from '../../models'
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css';
import { addItem, removeItem } from '../../redux/stores/stashes.store'
export default function Response({ prompt, removeResponse, onLoadComplete , responseId ,lang="js" }) {
    const [numDots, setNumDots] = useState(1)
    const {OPENAI_API_KEY:openAIKey} = useSelector(state=> state.env)
    const {ask, data, error, isLoading:loading} = useGetResponse(openAIKey)
    const [response, setResponse] = useState(null)
    const keyValueDB = useRef(getModel(tableEnum.RESPONSES))
    const dispatch = useDispatch()
    const [stashed, setStashed] = useState(false)
    const getResponse= async (prompt)=>{
        try{
            const db = keyValueDB.current;
            let res = await db.get(prompt);
            if(res)
                return res;
            
            res=await new Promise((resolve, reject)=>{
                ask(prompt,{
                    onError:()=>{
                        reject();
                    },
                    onSuccess:(data)=>{
                        db.add(prompt, data)
                            .then(()=>resolve(data) )
                            .catch(()=>reject());
                    }
                })
            })
            return res;

        } catch(e) {
            console.error(e.message);
            return null
        }

    }

    useEffect(()=>{
        if(data){
            setResponse(data)
        }
    },[data])

    useEffect(()=>{
        if(prompt){
            getResponse(prompt)
                .then(res=>{
                    setResponse(res);
                    onLoadComplete();
                })
                .catch(err=>{
                    console.log("unable to create response: "+ err.message); 
                })
        }
    },[])

    useEffect(()=>{
        if(!loading ){
            if(response?.name)
                onLoadComplete(response?.name ,responseId)
            return
        }
        const interval = setInterval(()=>{
            setNumDots(numDots=>numDots===4?1:numDots+1)
        }, 300)
        return ()=>clearInterval(interval)
    },[loading])

    const stashFunction = ()=>{
        if(!stashed){
            setStashed(true)
            dispatch(addItem([
                response,
                responseId
            ]))
        } else {
            setStashed(false)
            dispatch(removeItem(responseId))
        }
    }
    function getRenderedResponse(){
        return (
            <React.Fragment>
            <div className={'primary-border p-4 my-2 ' + (error && 'bg-red-100') }style={{maxWidth:'80%'}}>
                <div className='flex text-gray-400 font-thin gap-4'>
                    <FontAwesomeIcon icon={faRefresh} className='font-thin font-serif primary-border p-1 cursor-pointer active:scale-110' title='regenerate'
                    onClick={()=>{
                        const db = keyValueDB.current;
                        ask(prompt,{
                            onError:()=>{
                                //TODO: add error message
                            },
                            onSuccess:(data)=>{
                                db.add(prompt, data)
                                    .then(()=> setResponse(data))
                                    .catch(()=>console.error('unable to get response'));
                            }
                        })
                    }}/>
                    {
                        response?.function_def &&
                        <FontAwesomeIcon icon={faCopy} className='font-thin font-serif primary-border p-1  cursor-pointer active:scale-110' title='copy'
                            onClick={()=>{
                                navigator.clipboard.writeText(response?.function_def);
                            }}/>
                    }
                    <FontAwesomeIcon icon={faTimesCircle} className='font-thin font-serif primary-border p-1 ml-auto  cursor-pointer active:scale-110' title='close'
                    onClick={()=>{
                        removeResponse()
                    }}/>
                </div>
                <div className={'flex bg-gray-200 my-2 ' + (error && 'bg-red-600')}>
                    <pre className='ml-auto bg-gray-100 p-4 whitespace-break-spaces' style={{width:'96%'}}>
                        {
                            error?
                            <span>
                                {error?.message}
                            </span>
                            :<code dangerouslySetInnerHTML={{ __html: highlight(response?.function_def ?? '' , languages.js, 'js')  }} 
                            className=''/>
                        }
                    </pre>
                </div>
                
                {
                    !error &&
                    <div className='flex' >
                        <button className='bg-black text-sm text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out mt-3 active:bg-slate-700 cursor-pointer ml-auto'
                            onClick={stashFunction}
                        >
                            <span>  
                                {
                                    !stashed? "STASH FUNCTION": "UNSTASH FUNCTION"
                                } 
                            </span>
                            <FontAwesomeIcon icon={faArrowRight} className='text-white pl-5 pr-5'/>
                        </button>
                    </div>
                }
            </div>
            </React.Fragment>
        )
    }

    return (
        <div className='flex flex-col'>
            <div className=''>
                <FontAwesomeIcon icon={faMicrochip} className={'p-3 primary-border text-purple-500 '+(!loading && 'text-green-500')}/>
            </div>
            {
                loading?
                    <div className='primary-border w-10 text-center my-2'>
                        {
                            ".".repeat(numDots)
                        }
                    </div>
                    : getRenderedResponse()
            }
        </div>
    )
}