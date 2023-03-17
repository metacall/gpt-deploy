import axios from 'axios'
import React, { useCallback, useEffect, useState } from 'react'
import styles from './DeployedFunctionPanel.module.scss'
import Deployment from './components/Deployment/Deployment';
import RightPanel from '../../components/RightPanel/RightPanel';
import { LoaderSlider, LoaderSpinner } from '../../components/Loader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSuitcaseRolling } from '@fortawesome/free-solid-svg-icons';
import SlidingTabs from '../../components/SlidingTabs/SlidingTabs';
function DeployedFunctionPanel() {
    const [funcs , setFuncs] = useState([2]);
    const [isOpen , setIsOpen] = useState(true);
    const [selectedIndex , setSelectedIndex] = useState(-1);
    const [loading , setLoading] = useState(true);
    const [title , setTitle] = useState('add 3 numbers');
    useEffect(() => {
    axios.get("/api/getDeployments").then(res=>res.data).then(data=>{
        data= data?.[0]?.packages?.node?.[0]?.scope?.funcs;
        if(!data)
            setFuncs([2])
        else
            setFuncs(data)
        setLoading(false);
    }).catch(()=>{
        console.error('unable to fetch');
        setLoading(false);
    })
    },[])

    const onClose = useCallback(()=>{
        setIsOpen(false);
        setSelectedIndex(-1);
    },[])

    const onClickFunction = useCallback((index)=>{
        setIsOpen(true);
    },[])

    function getNoDeployment(){
        return (
            <div className={styles.NoDeployment}>
                <div className={styles.NoDeploymentText}>
                    No Deployments Found
                </div>
                <div className={styles.suggestionsAI}>
                    <span className={styles.try}>Try</span> our intelligent deployment assistant to deploy your functions.
                </div>
                <div className={styles.workbench}>
                <span className={styles.try}>Try</span> our workbench.
                </div>
            </div>
        )
    }
    console.log(funcs.length)
    return (
        <React.Fragment>
          <LoaderSpinner loading={loading} className={styles.LoaderSpinner}/>
          {
            !loading && funcs.length === 0 
            ? getNoDeployment()
            :!loading && <React.Fragment>
                <RightPanel isOpen={isOpen} title={title} onClose={onClose}>
                    {
                        <SlidingTabs Top = {'hello how are you doing'} Bottom = {"looking you"}/>
                    }
                </RightPanel>
                    <div className={styles.DeployedFunctionPanel}> 
                    <Deployment onClickFunction={onClickFunction}/>
                    <Deployment onClickFunction={onClickFunction}/>
                    {/* <Deployment onClickFunction={onClickFunction}/>
                    <Deployment onClickFunction={onClickFunction}/>
                    <Deployment onClickFunction={onClickFunction}/>
                    <Deployment onClickFunction={onClickFunction}/>
                    <Deployment onClickFunction={onClickFunction}/>
                    <Deployment onClickFunction={onClickFunction}/>
                    <Deployment onClickFunction={onClickFunction}/>
                    <Deployment onClickFunction={onClickFunction}/> */}
                    </div>
            </React.Fragment>
        }
        </React.Fragment>
    )
}

export default DeployedFunctionPanel
