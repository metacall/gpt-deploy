import React,{useState, useContext} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight} from '@fortawesome/free-solid-svg-icons'
import InputBox from '../InputBox/InputBox'
import SelectionBox from '../SelectionBox/SelectionBox'
import InputOption from '../InputOption/InputOption'
import { setMetacallToken, setModel, setOpenAIKey } from '../../redux/stores/env.store'
import cog from './cog.svg'
import {MessageContext} from '../../components/MessageStack/MessageStack'
function CodeBox() {
  const dispatch = useDispatch()
  const [text, setText] = useState('')
  const {
    OPENAI_API_KEY:openAIKey,
    MODEL: model,
    METACALL_TOKEN: metacallToken
  } = useSelector(state=> state.env)
  const {addSuccess, addError} = useContext(MessageContext)
  const [deployable, setDeployable] = useState(openAIKey && model && metacallToken)
  const [dataAlreadySet, setDataAlreadySet] = useState(deployable)

  const saveData = ()=>{
    const data =`MODEL=${model}
    OPENAI_API_KEY=${openAIKey}
    METACALL_TOKEN=${metacallToken}`
    
    localStorage.setItem('env',data)
    setDeployable(true)
    addSuccess('Data saved successfully!')
  }

  const setting = ()=>{
    setDeployable(false)
    setDataAlreadySet(false)
  }

  return (
    <div className='h-full w-full flex flex-col gap-3 box-border pr-2'>
        <img src={cog} className='mt-auto w-10 border border-gray-300 p-3 rounded outline-icon active:bg-slate-200 cursor-pointer' onClick={setting}/>
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
          <InputBox placeholder='sk-...' text={openAIKey} setText={(value)=>dispatch(setOpenAIKey(value))}/>
          <div className='flex gap-4 mt-3 rounded'>
            <InputOption value={model} setValue={(value)=>dispatch(setModel(value))}/>
            <button className='bg-black rounded filter active:bg-slate-700' onClick={saveData} title='save'>
              <FontAwesomeIcon icon={faArrowRight} className='text-white pl-5 pr-5'/>
            </button>
          </div>
          </React.Fragment>
          :
          <p className='text-sm'>
              <strong>All set! You can click on the <img src={cog} className='inline'/> to change settings.</strong> <br/>
              Let's now unleash the power of MetaCall GPT and create something remarkable together!
          </p>
          }
        </div>
        }

        <div className='flex flex-row w-full p-2 border border-gray-300 rounded'>
          <input type='text' className='flex w-full outline-none mr-2 text-gray-700' value={text} 
              placeholder='Write a function description'
              onChange={(e)=>setText(e.target.value)}/>

              <button className={
               deployable && text? 'bg-black rounded text-white whitespace-nowrap p-1 pl-3 pr-3 active:bg-slate-700'
               : 'bg-gray-300  text-white whitespace-nowrap p-1 pl-3 pr-3 rounded'
              } disabled={!deployable || !text}>
                GENERATE FUNCTION
            </button>
        </div>
    </div>
  )
}

export default CodeBox
