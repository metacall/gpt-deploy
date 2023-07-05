import React from 'react';
import styles from './Home.module.scss';
import Header from './Header/Header';
import WorkBox from './WorkBox/WorkBox';
const Home = () => {
    
    return (
        <div className={styles.home}>
            <Header/>
            <WorkBox/>
        </div>
    )
    
}

export default Home
