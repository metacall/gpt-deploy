import React, { createContext, useState } from 'react'
import {nanoid} from 'nanoid'
import Messages from './components/Messages'
export const MessageContext = createContext()
function MessageStack({children}) {
  const [messageList , setMessageList] = useState([])
  function add(message,type){
    const id= nanoid()
    setMessageList([
      ...messageList ,{
      id,
      message,
      type
    }])

    setTimeout(()=>{
      setMessageList(prev=>prev.filter(msg=>msg.id!=id))
    }, 3000);
  }

  function addSuccess(message){
    add(message, 'success')
  }

  function addError(message){
    add(message ,'error')
  }

  const adders = {
    addError,
    addSuccess
  }
  return (
    <MessageContext.Provider value={adders}>
      <Messages messageList = {messageList}/>
      {children}
    </MessageContext.Provider>
  )
}

export default MessageStack
