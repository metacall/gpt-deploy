import React from 'react'
import styles from './TabButton.module.scss'
function TabButton({name, handleClose, rename, isSelected}) {
  const [isEditing, setIsEditing] = React.useState(false)
  
  return (
    <div className={styles.TabButton}  onDoubleClick={()=>{
      setIsEditing(true)
    }}>
        <div className={styles.mainButton}>
            <span className={styles.name}>
              {
                isEditing ?
                <input className={styles.editingText} type="text" value = {name} onChange={(e)=>{
                  rename(e.target.value)
                }} 
                onKeyDown = {(e)=>{
                  if(e.key === "Enter")
                    setIsEditing(false)
                }}
                />
                :
                name
              }
              </span>
            <span className={styles.remove} onClick={(e)=>{
              e.stopPropagation();
              e.preventDefault();
              handleClose()
              }}>&times;</span>
        </div>
    </div>
  )
}

export default TabButton
