import React from 'react'
import styles from './StashBox.module.scss'
import {useSelector, useDispatch} from 'react-redux'
import StashList from '../StashList/StashList'
import { removeItem } from '../../redux/stores/stashes.store'
function StashBox({deployable = false}) {
  const dispatch = useDispatch();
  const {collection} = useSelector(state => state.stashes);
  return (
    <div className={'h-full w-1/4 primary-border p-2 flex flex-col'}>
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
    
     <StashList fnList={collection}/>
      
      <button 
      className= {
            !deployable ?
            'bg-black text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out mt-3 active:bg-slate-700 cursor-pointer' :
            'bg-gray-300  text-white font-bold py-2 px-4 rounded mt-3'
      }
      disabled={!deployable}>
            DEPLOY
       </button>
    </div>
  )
}

export default StashBox
