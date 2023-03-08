import { useEffect, useRef, useState } from 'react'
import styles from './Ask.module.scss'
export default function Ask({ query }) {
    return (
        <div className={styles.ask}>
            <pre className={styles.ask__content}>
                {query}
            </pre>
        </div>
    )
}