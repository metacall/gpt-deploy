import React from 'react'
import styles from './Header.module.scss'
function Header() {
  return (
    <div className={styles.header}>
        <div className={styles.logoWrapper} onClick={()=>window.open("https://hub.metacall.io","_new")}>
            <img src={"./logo.png"} height="100%"/>
            <h1 className={styles.headName}>Lambda Deploy </h1>
        </div>
        <div className={styles.menuWrapper}>
            <div><a href="https://hub.metacall.io/pricing" target="_new">Pricing</a></div>
            <div><a href="https://hub.metacall.io/contact" target="_new">Contact Us</a></div>
            <div><a href="https://hub.metacall.io/faq" target="_new">FAQ</a></div>
        </div>
        <div className={styles.userLoginWrapper}>
            <div><a href="https://dashboard.metacall.io" target="_new">Log in</a></div>
        </div>
    </div>
  )
}

export default Header;
