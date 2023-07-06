import React,{ useEffect, useRef, useState, useContext } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faEdit, faMicrochip, faRefresh, faSave } from '@fortawesome/free-solid-svg-icons'
import { faCopy, faTimesCircle } from '@fortawesome/free-regular-svg-icons'
import useGetResponse from '../../customHooks/useGetResponse'
import {getModel, tableEnum} from '../../models'
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css';
import { addItem, removeItem } from '../../redux/stores/stashes.store'
import Confirm from '../Confirm/Confirm'
import { MessageContext } from '../MessageStack/MessageStack'
export default function Response({ prompt, removeResponse, onLoadComplete , responseId ,lang="js" }) {
    const [numDots, setNumDots] = useState(1)
    const {addError, addSuccess} = useContext(MessageContext)
    const {OPENAI_API_KEY:openAIKey, MODEL: model} = useSelector(state=> state.env)
    const {ask, error, isLoading:loading} = useGetResponse(openAIKey, model)
    const [response, setResponse] = useState(null)
    const keyValueDB = useRef(getModel(tableEnum.RESPONSES))
    const dispatch = useDispatch()
    const [stashed, setStashed] = useState(false)
    const [editable, setEditable] = useState(false)
    const [showConfirmation, setShowConfirmation] = useState(false)
    const codeRef = useRef(null)
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
            addError(e.message);
            return null
        }

    }

    useEffect(()=>{
        if(prompt){
            getResponse(prompt)
                .then(res=>{
                    setResponse(res);
                    onLoadComplete();
                })
                .catch(err=>{
                    addError(err?.message ?? "Unable to create response"); 
                })
        }
    },[prompt])

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

    useEffect(()=>{
        codeRef.current.innerHTML =  highlight(response?.function_def ?? '' , languages[lang], lang)
    },[response?.function_def])

    const handleNameChange = (e) => {
        if(["Enter", "Tab", "Escape", " "].includes(e.key)){
            e.preventDefault();
            e.stopPropagation();
            const db = keyValueDB.current;
            response.name = e.target.innerText;
            response.function_def = codeRef.current.innerText;
            db.add(prompt, response)
                .then(()=> {
                    setResponse({...response})
                    addSuccess("Changed name to "+e.target.textContent)
                })
                .catch(()=>addError('Unable to change response'));
            
            e.target.contentEditable = false;
        } else 
            if(!(/^[0-9a-zA-Z$_]$/.test(e.key))){
                e.preventDefault();
                e.stopPropagation();
            }
    }

    const handleNameMouseClick = (e) => {
        e.target.contentEditable = true;
    }
    useEffect(()=>{
        const functionNameEls = codeRef.current.querySelectorAll('.function-variable')
        for(let i=0; i<functionNameEls.length; i++){
            functionNameEls[i].addEventListener('keydown', handleNameChange)
            functionNameEls[i].addEventListener('dblclick', handleNameMouseClick)
        }

        return ()=>{
            for(let i=0; i<functionNameEls.length; i++){
                functionNameEls[i].removeEventListener('keydown', handleNameChange)
                functionNameEls[i].removeEventListener('dblclick', handleNameMouseClick)
            }
        }
    },[response])

    const handleInputKeyDown = (e) => {
        e.stopPropagation();
        
        if (e.key === 'Tab') {
            let chr = '\t';
            e.preventDefault(); 
            const selection = window.getSelection();
            const range = selection.getRangeAt(0);
            const tabNode = document.createTextNode(chr);
            range.insertNode(tabNode);
            range.setStartAfter(tabNode);
            range.setEndAfter(tabNode);
            selection.removeAllRanges();
            selection.addRange(range);
    } 
  };


    function getRenderedResponse(){
        return (
            <React.Fragment>
            <div className={'primary-border p-4 my-2 ' + (error && 'bg-red-100') }style={{maxWidth:'80%'}}>
                <div className='flex text-gray-400 font-thin gap-4'>
                    <FontAwesomeIcon icon={faRefresh} className='font-thin font-serif primary-border p-1 cursor-pointer active:scale-110' title='regenerate'
                    onClick={()=>{
                        const db = keyValueDB.current;
                        ask(prompt,{
                            onError:(err)=>{
                                addError(err?.response?.message ?? "Failed to regenerate response")
                            },
                            onSuccess:(data)=>{
                                db.add(prompt, data)
                                    .then(()=> setResponse(data))
                                    .catch(()=>addError('Unable to get response'));
                            }
                        })
                    }}/>
                    {
                        response?.function_def &&
                        <FontAwesomeIcon icon={faCopy} className='font-thin font-serif primary-border p-1  cursor-pointer active:scale-110' title={'copy'}
                            onClick={()=>{
                                navigator.clipboard.writeText(response?.function_def);
                            }}/>
                    }
                    {
                        response?.function_def &&
                        <FontAwesomeIcon icon={editable? faSave :faEdit} className={'font-thin font-serif primary-border p-1  cursor-pointer active:scale-110 '} title={editable? 'save': 'edit'}
                            onClick={()=>{
                                if(editable){
                                    const db = keyValueDB.current;
                                    response.function_def = codeRef.current.innerText;
                                    db.add(prompt, response)
                                    .then(()=> {
                                        setResponse({...response})
                                        addSuccess('Response saved')
                                    })
                                    .catch(()=>addError, addSuccess('unable to get response'));
                                }
                                setEditable(state => !state)

                                }
                            }/>
                    }
                    <FontAwesomeIcon icon={faTimesCircle} className='font-thin font-serif primary-border p-1 ml-auto  cursor-pointer active:scale-110' title='close'
                    onClick={()=>{
                        setShowConfirmation({
                            message: 'Are you sure you want to remove this response?',
                            onOk: ()=>{
                                removeResponse()
                            },
                            onCancel: ()=>{
                            }
                        })
                    }}/>
                </div>
                <div className={'flex bg-gray-200 my-2 ' + (error && 'bg-red-600')}>
                    <pre className='ml-auto bg-gray-100 p-4 whitespace-break-spaces' style={{width:'96%'}}>
                        {
                            error?
                            <span>
                                {error?.message}
                            </span>
                            :
                            <div 
                                className={'outline-none '+ (editable?'bg-white font-semibold p-2':'') } 
                                contentEditable={editable}
                                suppressContentEditableWarning={true}
                                onKeyDown={handleInputKeyDown}
                                ref={codeRef} >
                            </div>                            
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
        <React.Fragment>
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
            <Confirm showPrompt={showConfirmation} setShowPrompt={setShowConfirmation}/>
        </React.Fragment>
    )
}