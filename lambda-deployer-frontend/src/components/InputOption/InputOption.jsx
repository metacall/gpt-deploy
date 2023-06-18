import React from 'react'

function InputOption({value, setValue}) {
  return (
    <div className='text-xs flex w-1/4 p-2 border border-gray-300 items-center'>
      <span className='h-4 text-gray-700'>
        Model
      </span>
      <select className='w-full outline-none ml-5 text-gray-400' value={value} onChange={(e)=>setValue(e.target.value)}>
        <option value='gpt-3.5-turbo'>gpt-3.5-turbo</option>
        <option value='davinci'>davinci</option>
       </select>
    </div>
  )
}

export default InputOption
