import React, { useCallback, useContext, useEffect, useState } from 'react'
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

    useEffect(()=>{
        setTabsName(codes.map(({id, title})=>[title , id]))   
        setTabCode(codes.map(({id, code})=>[code, id]))  
    },[codes])

    const addTabsName = useCallback((name)=>{
        dispatch(updateCode([...codes, {id: nanoid(), title: name, code: ""}]))
    },[])

    const setSelectedIndex = useCallback((index)=>{
        dispatch(updateSelectedIndex(index))
    },[])

    const setCode = useCallback((code , id)=>{
        const newCodes = codes.map((c,i)=>c.id === id ?{...c, code}:c)
        dispatch(updateCode(newCodes))
    })
    return (
        <div className={styles.home}>
            <Header/>
            <Notebook 
                Selectors={["Deployed functions","Deploy", "Code Editor"]}
                Panels={[
                    <DeployedFunctionPanel/>,
                    <DeployPanel/>,
                    <CodeTab 
                        Selectors={tabsName} 
                        Codes = {tabCode}
                        setTabsName={setTabsName} 
                        addTabsName={addTabsName} 
                        Panels={
                            tabsName.map((tabName,index)=> <CodeEditor code={codes[index].code} setCode={
                                (code)=>setCode(code, codes[index].id)
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
