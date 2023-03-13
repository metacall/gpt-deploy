import React from 'react'
import styles from './TabButton.module.scss'
function TabButton({name, handleClose, isSelected}) {

  return (
    <div className={styles.TabButton}>
        <div className={styles.mainButton}>
            <span className={styles.name}>{name}</span>
            <span className={styles.remove} onClick={handleClose}>&times;</span>
        </div>
    </div>
  )
}

export default TabButton
