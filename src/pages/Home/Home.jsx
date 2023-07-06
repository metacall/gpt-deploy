import React, {useState, useEffect} from 'react';
import styles from './Home.module.scss';
import Header from './Header/Header';
import WorkBox from './WorkBox/WorkBox';
import DeployedFunctionPanel from '../DeployedFunctionPanel/DeployedFunctionPanel';
import {Routes, Route, useNavigate} from 'react-router-dom'
const paths = ['/', '/deployed']
const Home = () => {
    const [deploymentPanelSelected , setDeploymentPanelSelected] = useState(paths.indexOf(window.location.pathname))
    const navigate = useNavigate();
    useEffect(()=>{
        function handleKeyDown(event){
            if(event.key === 'Escape'){
                navigate(paths[(deploymentPanelSelected+1)%(paths.length)])
                setDeploymentPanelSelected((deploymentPanelSelected+1)%(paths.length))
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return ()=>{
            window.removeEventListener('keydown', handleKeyDown)
        }
    },[navigate,deploymentPanelSelected])

    return (
        <div className={styles.home}>
            <Routes>
                <Route index element={
                    <React.Fragment>
                        <Header/>
                        <WorkBox/>
                    </React.Fragment>
                }/>
                <Route path="/deployed" element={
                    <DeployedFunctionPanel/>
                }/>
            </Routes>
        </div>
    )
    
}

export default Home
