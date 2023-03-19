import React, { useCallback, useEffect, useState } from 'react'
import styles from './Home.module.scss'
import Notebook from '../../components/Notebook/Notebook';
import DeployPanel from '../DeployPanel/DeployPanel';
import DeployedFunctionPanel from '../DeployedFunctionPanel/DeployedFunctionPanel';
import Header from './Header/Header';
import CodeEditor from '../../components/CodeEditor/CodeEditor';
import CodeTab from '../../components/CodeTab/CodeTab';
import { nanoid } from 'nanoid';
import { useDispatch, useSelector } from 'react-redux';
import { updateCode, updateSelectedIndex } from '../../redux/stores/code.store';
const Home = () => {
    const dispatch = useDispatch();
    const {codes, selectedIndex} = useSelector(state => state.codes);
    const [tabsName , setTabsName] = useState(codes.map(({id, title})=>[title , id]))
    const [tabCode, setTabCode] = useState(codes.map(({id, code})=>[code, id]))

    const addTabsName = useCallback((name)=>{
        dispatch(updateCode({
           codesData: [...codes, {id: nanoid(), title: name, code: ""}],
           modificationType: "add"
        }))
    },[codes, dispatch])
    
    const closeTabFromId = useCallback((id)=>{
        const newCodes = codes.filter(c=>c.id !== id)
        dispatch(updateCode({
            codesData: newCodes,
            modificationType: "remove"
         }))
         dispatch(updateSelectedIndex(0))
    },[codes, dispatch])
    
    const setSelectedIndex = useCallback((index)=>{
        dispatch(updateSelectedIndex(index))
    },[dispatch])
    
    useEffect(()=>{
        setTabsName(codes.map(({id, title})=>[title , id]))   
        setTabCode(codes.map(({id, code})=>[code, id]))  
    },[codes])

    const setCode = useCallback((code , id)=>{
        const newCodes = codes.map((c,i)=>c.id === id ?{...c, code}:c)
        dispatch(updateCode({codesData: newCodes, modificationType: "update"}))
    }, [codes, dispatch])

    return (
        <div className={styles.home}>
            <Header/>
            <Notebook 
                Selectors={["Deployed Packages","Deploy", "Workbench"]}
                Panels={[
                    <DeployedFunctionPanel/>,
                    <DeployPanel/>,
                    <CodeTab 
                        Selectors={tabsName} 
                        Codes = {tabCode}
                        setTabsName={setTabsName} 
                        addTabsName={addTabsName} 
                        closeTabFromId={closeTabFromId}
                        Panels={
                            tabsName.map((tabName,index)=> <CodeEditor key = {index} code={codes[index]?.code??""} setCode={
                                (code)=>setCode(code, codes[index]?.id??"")
                            }/>)
                        }
                        selectedIndex={selectedIndex}
                        setSelectedIndex={setSelectedIndex}
                    />
                ]}
                /> 
        </div>
    )
    
}

export default Home
