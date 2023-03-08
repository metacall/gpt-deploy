import React, { useContext, useEffect, useState } from 'react'
import styles from './Home.module.scss'
import Notebook from '../../components/Notebook/Notebook';
import DeployPanel from '../DeployPanel/DeployPanel';
import DeployedFunctionPanel from '../DeployedFunctionPanel/DeployedFunctionPanel';
import Header from './Header/Header';
import CodeEditor from '../../components/CodeEditor/CodeEditor';
const Home = () => {
    const [prompts,setPrompts] = useState([]);
    return (
        <div className={styles.home}>
            <Header/>
            <Notebook 
                Selectors={["Deployed functions","Deploy", "Code Editor"]}
                Panels={[
                    <DeployedFunctionPanel/>,
                    <DeployPanel prompts={prompts} setPrompts={setPrompts}/>,
                    <CodeEditor/>
                ]}
                /> 
        </div>
    )
    
}

export default Home
