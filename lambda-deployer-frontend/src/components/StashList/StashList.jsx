import React from 'react'
import flask from './flask.svg'
import styles from './StashList.module.scss'
export default function StashList({fnList}) {
  return (
    <div className='overflow-scroll no-scrollbar' style={{flexGrow: 1}}>
        <div className=''>
        {
            fnList.map(([fn,id],index)=>{
                return <div key={index} className={'h-10 cursor-pointer w-full flex items-center justify-center mt-2 bg-green-200 border hover:bg-green-400 border-gray-300 transition '+styles.box}>
                    <div className='ml-2 truncate overflow-ellipsis text-center w-full text-gray-500'>{fn?.name}</div>
                    <img src = {flask} className={'ml-auto mr-2 ' + styles.img}/>
                </div>
            })
        }
        </div>
    </div>
  )
}
