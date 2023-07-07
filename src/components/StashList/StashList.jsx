import React, {useState, useRef, useContext} from 'react'
import flask from './flask.svg'
import styles from './StashList.module.scss'
import ContextMenu from '../ContextMenu/ContextMenu'
import {useDispatch, useSelector} from 'react-redux'
import { removeItem } from '../../redux/stores/stashes.store'
import { tableEnum, getModel } from '../../models'
import { MessageContext } from '../MessageStack/MessageStack'

const options = ['Deploy','Delete']
export default function StashList({fnList}) {
  const [controller, setController] = useState(null)
  const {stashedKeys} = useSelector(state => state.stashes);
  const dispatch = useDispatch()
  const {addError} = useContext(MessageContext)
  const stashedKeysDB = useRef(getModel(tableEnum.STASHED_KEYS))
  return (
      <div className='overflow-scroll no-scrollbar' style={{flexGrow: 1}}>
          <div className=''>
          {
              fnList.map(([fn,id])=>{
                    return  <ContextMenu options={options} onSelect={(option)=>{
                      switch(option){
                        case 'Delete':
                          stashedKeysDB.current.add('keys', 
                            stashedKeys.filter((key)=>key !== id)
                          ).then(()=>{
                            dispatch(removeItem(id))
                          }).catch(()=>{
                            addError('Error removing function '+ fn?.name)
                          })
                          break;
                        default:
                          break;
                      }
                      }} title='Options' controller={controller} setController={setController}
                      key = {id}>
                        <div key={id} className={'h-10 cursor-pointer w-full flex items-center rounded-sm justify-center mt-2 bg-gray-200 border hover:bg-gray-400 border-gray-300 transition '+styles.box}>
                              <div className='ml-2 truncate overflow-ellipsis text-center w-full hover:text-white transition-colors'>{fn?.name}</div>
                              <img src = {flask} className={'ml-auto mr-2 ' + styles.img} alt="options"
                                onClick={(e)=>{
                                  e.stopPropagation()
                                  setController({x: e.clientX, y: e.clientY})
                                }}
                              />
                        </div>
                      </ContextMenu>
              })
          }
          </div>
      </div>
  )
}
