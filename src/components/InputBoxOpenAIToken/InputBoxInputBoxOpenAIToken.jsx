import React from 'react'
import { faCheck, faTimes, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from './InputBoxOpenAIToken.module.scss'
function InputBoxOpenAIToken({text, setText, setAvailableModels, placeholder='', isLoading,  className=''}) {
    return (
        <div className={'flex w-full p-2 border rounded border-gray-300 '+styles.textBox}>
            <input type='text' className='w-full outline-none mr-2 text-gray-700' value={text} 
            placeholder={placeholder}
            onChange={(e)=>setText(e.target.value)}/>
            <span className={'ml-auto flex gap-4 text-xs justify-center items-center '+styles.controller}>
                <FontAwesomeIcon icon={faTimes} className='cursor-pointer' onClick={()=>setText('')}/>
                {
                    !isLoading?
                    <FontAwesomeIcon icon={faCheck} className='cursor-pointer' onClick={setAvailableModels}/>
                    :
                    <FontAwesomeIcon icon={faSpinner} className={'cursor-pointer animate-spin '}/>
                }
            </span>
        </div>
    )
}

export default InputBoxOpenAIToken
