import React from 'react'
import styles from './Messages.module.scss'
function Messages({messageList}) {
  if(!messageList || messageList.length==0)
    return null
  return (
    <div className={styles.Messages}>
      <ul>
        {
            messageList.map(message=>{
                return <li key={message.id} className={ styles.messageBox }>
                <span className={styles[message.type] + " "+styles.message }>{message.message}</span> 
                </li>
            })
        }
      </ul>
    </div>
  )
}

export default Messages
