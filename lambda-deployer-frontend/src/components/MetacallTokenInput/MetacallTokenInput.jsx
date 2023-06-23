import React, {useState} from 'react'
function MetacallTokenInput({text, setText, placeholder='', className='', ...props}) {
    return (
        <div className='flex w-full p-2 primary-border my-3 bg-white'>
            <input type='text' className={'bg-white w-full outline-none mr-2  ' + (props.disabled? 'text-sm text-gray-400': 'text-gray-700')} value={text} 
            placeholder={placeholder}
            onChange={(e)=>setText(e.target.value)} 
            {...props}/>
        </div>
    )
}

export default MetacallTokenInput
