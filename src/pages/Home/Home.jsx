import React, { useCallback, useEffect, useState } from 'react'
import styles from './Home.module.scss'
import { nanoid } from 'nanoid';
import { useDispatch, useSelector } from 'react-redux';
import { updateCode, updateSelectedIndex } from '../../redux/stores/code.store';
import Header from './Header/Header'
import WorkBox from './WorkBox/WorkBox';
const Home = () => {
    const dispatch = useDispatch();
    
    return (
        <div className={styles.home}>
            <Header/>
            <WorkBox/>
        </div>
    )
    
}

export default Home
