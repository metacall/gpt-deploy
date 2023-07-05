import React,{useState} from 'react'

function InputOption({value, setValue, options}) {

  return (
    <div className='text-xs flex w-1/4 p-2 border border-gray-300 items-center'>
      <span className='h-4 text-gray-700'>
        Model
      </span>
      <select className='w-full outline-none ml-5 text-gray-400 no-scrollbar' value={value} onChange={(e)=>setValue(e.target.value)}>
        {
          options && options.map((option, index)=>{
            return <option value={option} key={index}>
              {option}
            </option>
          })
        }
       </select>
    </div>
  )
}

export default InputOption
