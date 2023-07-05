import React, {useState} from 'react'
import { faCheck, faTicket, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from './InputBoxOpenAIToken.module.scss'
import axios from 'axios'
function InputBoxOpenAIToken({text, setText, setAvailableModels, placeholder='', className=''}) {
    return (
        <div className={'flex w-full p-2 border rounded border-gray-300 '+styles.textBox}>
            <input type='text' className='w-full outline-none mr-2 text-gray-700' value={text} 
            placeholder={placeholder}
            onChange={(e)=>setText(e.target.value)}/>
            <span className={'ml-auto flex gap-4 text-xs justify-center items-center '+styles.controller}>
                <FontAwesomeIcon icon={faTimes} className='cursor-pointer' onClick={()=>setText('')}/>
                <FontAwesomeIcon icon={faCheck} className='cursor-pointer' onClick={setAvailableModels}/>
            </span>
        </div>
    )
}

export default InputBoxOpenAIToken
