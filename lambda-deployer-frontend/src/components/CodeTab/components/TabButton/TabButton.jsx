import React from 'react'
import styles from './TabButton.module.scss'
function TabButton({name, isSelected}) {
  return (
    <div className={styles.TabButton}>
        <div className={styles.mainButton}>
            <span>{name}</span>
        </div>
    </div>
  )
}

export default TabButton
