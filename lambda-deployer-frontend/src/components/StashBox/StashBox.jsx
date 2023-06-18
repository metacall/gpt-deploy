import React from 'react'
import StashList from '../StashList/StashList'
import styles from './StashBox.module.scss'
function StashBox({deployable = false}) {
  return (
    <div className={'h-full w-1/4 border border-gray-300 p-2 flex flex-col'}>
      <p className='text-base font-semibold text-gray-600'>
        STASHED FUNCTIONS
      </p>
      {
        !deployable ? (
            <p className='text-gray-400 text-xs mt-3 mb-3'>
                Generate functions and add them to deploy
            </p>
        ) : (
            null
        )
      }
    
     <StashList />
      
      <button 
      className= {
            !deployable ?
            'bg-black text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out mt-3 active:bg-slate-700 cursor-pointer' :
            'bg-gray-300  text-white font-bold py-2 px-4 rounded mt-3'
      }
      disabled={!deployable}>
            Deploy
       </button>
    </div>
  )
}

export default StashBox
