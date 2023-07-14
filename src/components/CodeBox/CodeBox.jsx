import React,{useState, useContext, useRef, useCallback} from 'react'
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faCaretDown, faCaretUp} from '@fortawesome/free-solid-svg-icons'
import InputBoxOpenAIToken from '../InputBoxOpenAIToken/InputBoxInputBoxOpenAIToken'
import InputOption from '../InputOption/InputOption'
import { setMetacallToken, setModel, setOpenAIKey } from '../../redux/stores/env.store'
import cog from './cog.svg'
import {MessageContext} from '../../components/MessageStack/MessageStack'
// import { getModels } from '../../backend_logic/controller/function_generator'
import getModels from '../../backend_logic/utils/getModel';
import CodeGeneration from '../CodeGeneration/CodeGeneration';
import { nanoid } from 'nanoid';
import { setPrompts as updatePrompts } from '../../redux/stores/prompts.store';
import MetacallTokenInput from '../MetacallTokenInput/MetacallTokenInput';
import { useEffect } from 'react';
import languageIdToExtensionMapping from '../../constants/languageIdToExtensionMapping'
import extensionToLanguageId from '../../constants/extensionsToLanguageId';
import parseCode from '../../backend_logic/controller/function_parser';
import { useDropzone } from 'react-dropzone';
import { tableEnum, getModel } from '../../models';
import extensionsToLanguageId from '../../constants/extensionsToLanguageId';

const programmingLanguages = Object.keys(languageIdToExtensionMapping);
function CodeBox() {
  const dispatch = useDispatch()
  const {prompts} = useSelector(state => state.prompts);
  const [text, setText] = useState('')
  const [searchParams] = useSearchParams();
  const {
    OPENAI_API_KEY:openAIKey,
    MODEL: model,
    METACALL_TOKEN: metacallToken
  } = useSelector(state=> state.env)
  const {addSuccess, addError} = useContext(MessageContext)
  const [options, setOptions] = useState(null)
  const responseDB = useRef(getModel(tableEnum.RESPONSES))
  const [isOptionLoading , setIsOptionLoading] = useState(false)
  const [deployable, setDeployable] = useState(openAIKey && model && metacallToken)
  const [dataAlreadySet, setDataAlreadySet] = useState(deployable)
  const [selectedLanguage, setSelectedLanguage] = useState(programmingLanguages[0])
  const [chooseLangIsShown, setChooseLangIsShown] = useState(false)
  const [loginByToken, setLoginByToken] = React.useState(false)
  const {isFullscreen} = useSelector(state=>state.fullscreen)
  const saveData = useCallback(()=>{
    const data =`MODEL=${model}
    OPENAI_API_KEY=${openAIKey}
    METACALL_TOKEN=${metacallToken}`
    
    localStorage.setItem('env',data)
    setDeployable(true)
    addSuccess('Data saved successfully!')
  }, [addSuccess, model, openAIKey, metacallToken]) 

  const setting = useCallback(()=>{
    if(deployable ^ dataAlreadySet){
      setDeployable( false)
      setDataAlreadySet(false)
    } else {
      setDeployable(state => !state)
      setDataAlreadySet(state => !state)
    }
  },[dataAlreadySet, deployable])
  
  async function onDrop(acceptedFiles){
    const extensionSupported = Object.keys(extensionsToLanguageId)
    acceptedFiles = acceptedFiles.filter(file=>extensionSupported.includes(file.name.split('.').at(-1)) && !(/node_modules/.test(file.path)))
    console.log(acceptedFiles)
    const addPrompt = await Promise.all(acceptedFiles.map(file=>{
      return new Promise((resolve, reject)=>{
        const reader = new FileReader()
        reader.onload = async () => {
          const text = reader.result;
          const filename = file.path;
          const extension = filename.split('.')[1];
          const language_id = extensionToLanguageId[extension];
          const response = parseCode(text, language_id);
          response.language_id = language_id;

          const db = responseDB.current;
          const promptId = nanoid();
          await db.add(promptId , response)
          
          resolve([filename , promptId, {
            timestamp : new Date()-0,
            language: language_id,
            filename: file.name,
          }])
        }
        reader.readAsText(file)
    })}))
    dispatch(updatePrompts([...prompts, ...addPrompt]))
  }

  const {getRootProps, isDragActive} = useDropzone({onDrop})

  useEffect(()=>{
    if(!deployable){
      function handleEnterPress(event) {
        if (event.key === 'Enter' ) {
          event.preventDefault();
          event.stopPropagation();
          saveData();
          setting();
        }
      }
      window.addEventListener('keydown', handleEnterPress);
      return () => {
        window.removeEventListener('keydown', handleEnterPress);
      }
    }
  },[deployable, saveData, setting])

  const retrieveModelOptions = ()=>{
    setIsOptionLoading(true)
    getModels(openAIKey)
    .then((models)=>{
      setIsOptionLoading(false)
      setOptions(models)
      if(models.length > 0)
        setModel(models[0])
      })
      .catch((err)=>{
      setIsOptionLoading(false)
      // if error stattus code is 401, then the key is invalid
      if(err.response.status === 401)
        addError('Invalid OpenAI API Key')
      else 
        addError('Something went wrong while fetching models')
      
      setOptions(null)
    })
  }

  function onSend(prompt){
    const id = nanoid();
    dispatch(updatePrompts([
      ...prompts, 
      [prompt ,id, {
        timestamp : new Date()-0,
        language: selectedLanguage,
      }]
    ]));
    setText("");
  }

  const handleEnterPress = (event) => {

    if(!text || !deployable)
      return 

    if (event.key === 'Enter' ) {
      onSend(text);
    }
  };
  const mt = searchParams.get('mt');
  useEffect(()=>{
    if(searchParams.get('mt')){
      dispatch(setMetacallToken(searchParams.get('mt')))
      setDataAlreadySet(false)
      setDeployable(false)
    }
  },[mt, dispatch, searchParams])

  return (
    <div className='h-full w-full flex flex-col gap-3 box-border pr-2 '>
      <div>
        {
          !isFullscreen &&
          <img src={cog} className={'w-10 border border-gray-300 p-3 rounded outline-icon active:bg-slate-200 cursor-pointer ' } alt="cog" onClick={setting}/>
        }  
        {
          !dataAlreadySet &&
        <div className={'w-full p-3 border border-gray-300 rounded '+(!deployable?'w-3/4':'')}>
          {
            !deployable?
            <React.Fragment>
          <p className='text-sm mb-4'>
            <strong>Thank you for joining MetaCall GPT! 😊</strong>
            <br/> <br/>
            <span>
              We kindly request you to provide your OpenAI API Key, which will be securely stored locally on the front end for this session only.</span>
            <br/>
            <span>
              Please rest assured that we prioritize your privacy and guarantee that your key will not be sent elsewhere.
            </span>
          </p>

          <MetacallTokenInput loginByToken={loginByToken} setLoginByToken = {setLoginByToken} placeholder='Metacall Token' text={metacallToken} setText={(value)=>dispatch(setMetacallToken(value))} disabled={searchParams.get('mt')}
          />
          <InputBoxOpenAIToken placeholder='sk-...' text={openAIKey} setText={(value)=>dispatch(setOpenAIKey(value))} isLoading={isOptionLoading} setAvailableModels={retrieveModelOptions}/>
            {
              options &&
              <div className='flex gap-4 mt-3 rounded'>
                <InputOption value={model} setValue={(value)=>dispatch(setModel(value))} options={options}/>
                <button className='bg-black rounded filter active:bg-slate-700' onClick={saveData} title='save'>
                  <FontAwesomeIcon icon={faArrowRight} className='text-white pl-5 pr-5'/>
                </button>
              </div>
            }
          </React.Fragment>
          :
          <div className='text-sm'>
              <strong>All set! You can click on the <img src={cog} className='inline' alt="cog"/> to change settings.</strong> <br/>
              <ul>
               <span className='font-bold'>Shortcuts: </span>
               <li> &gt; Escape: Toggling Between Deployments and Code Generation </li>
                <li>&gt; Ctrl + Shift + f : Toggle Fullscreen </li>
              </ul>
          </div>
          }
        </div>
        }
        </div>
        <CodeGeneration/>
        <div className={'flex mt-auto flex-row w-full p-2 border border-gray-300 rounded ' + (isDragActive? 'border-dashed border-4':'')} {...getRootProps()}>
          <input type='text' className='flex w-full outline-none mr-2 text-gray-700' value={text} 
              placeholder='Write a function description'
              onChange={(e)=>setText(e.target.value)}
              onKeyPress={handleEnterPress}
          />

            <div className='flex text-white relative'>
            { 
              chooseLangIsShown &&
              <React.Fragment>
                <div className={'flex items-center font-bold  w-full primary-border justify-center absolute z-10 right-0 bottom-full'}>
                    <ul className="[&>*:nth-child(odd)]:bg-gray-800 bg-gray-700 w-full">
                      {
                          programmingLanguages.map((lang, index)=>{
                            return <li key={index} className={'cursor-pointer text-center py-2 px-4 '+(selectedLanguage === lang ? 'text-white' : 'text-gray-400')} onClick={()=>{
                              setSelectedLanguage(lang)
                              setChooseLangIsShown(false)
                            }}>{lang}</li>
                          })
                      }
                    </ul>
                </div>
                  <hr/>
              </React.Fragment>
            }
            <button 
            className={'items-center justify-center  hidden md:flex w-full py-2 px-4 text-white rounded '+ (!(!deployable || !text) ? 'bg-black active:bg-slate-700': 'bg-gray-300 text-black')}
            onClick={()=>{
              onSend(text)
            }}
            disabled={!deployable || !text}
            >
                <span className='whitespace-nowrap '>GENERATE FUNCTION</span>
            </button>

            <button 
              className={'flex items-center w-20 bg-black justify-center active:bg-slate-700 py-2 px-4 rounded' }
              onClick={()=>setChooseLangIsShown(!chooseLangIsShown)}
            >
            <span className='mr-2'> {selectedLanguage} </span>  <FontAwesomeIcon icon={ chooseLangIsShown ? faCaretDown : faCaretUp} />
            </button>
          </div>
        </div>
    </div>
  )
}

export default CodeBox
