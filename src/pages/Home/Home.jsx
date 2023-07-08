import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux'
import styles from './Home.module.scss';
import Header from './Header/Header';
import WorkBox from './WorkBox/WorkBox';
import DeployedFunctionPanel from '../DeployedFunctionPanel/DeployedFunctionPanel';
import {Routes, Route, useNavigate} from 'react-router-dom'
import { setFullscreen } from '../../redux/stores/fullscreen.store';
const paths = ['/', '/deployed']
const Home = () => {
    const [deploymentPanelSelected , setDeploymentPanelSelected] = useState(paths.indexOf(window.location.pathname))
    const navigate = useNavigate();
    const {isFullscreen} = useSelector(state=>state.fullscreen)
    const dispatch = useDispatch()
    useEffect(()=>{
        function handleKeyDown(event){
            if(event.key === 'Escape'){
                navigate(paths[(deploymentPanelSelected+1)%(paths.length)])
                setDeploymentPanelSelected((deploymentPanelSelected+1)%(paths.length))
            } else if (event.key === 'F' && event.ctrlKey){
                dispatch(setFullscreen(!isFullscreen))
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return ()=>{
            window.removeEventListener('keydown', handleKeyDown)
        }
    },[navigate,deploymentPanelSelected, dispatch, isFullscreen])

    return (
        <div className={styles.home}>
            <Routes>
                <Route index element={
                    <React.Fragment>
                        {
                            !isFullscreen &&
                            <Header/>
                        }
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
