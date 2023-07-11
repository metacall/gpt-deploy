import React,{useState,useRef , useEffect, useCallback} from 'react'
import JSZip from 'jszip';
import axios from 'axios'
import Ask from '../../components/Ask/Ask'
import { nanoid } from 'nanoid';
import Response from '../../components/Response/Response'
import SearchBox from '../../components/SearchBox/SearchBox'
import styles from './DeployPanel.module.scss'
import SelectionBox from '../../components/SelectionBox/SelectionBox';
import {useSelector , useDispatch} from 'react-redux'
import { getModel , tableEnum } from '../../models';
import updatePrompts from '../../redux/stores/prompts.store'
function DeployPanel() {
    const dispatch = useDispatch();
    const {prompts} = useSelector(state => state.prompts);
    const chatBoxRef = React.useRef(null)
    const [collection, setCollection] = useState([]);
    const keyValueDB = useRef(getModel(tableEnum.PROMPTS));
    const firstTime = useRef(true);
    function goToLast(){
        setTimeout(()=>{
            const messageBody = chatBoxRef.current;
            messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
        }, 100)
    }

    function setPrompts(prompt){
        dispatch(updatePrompts(prompt));
    }
    function saveAllPrompts(){
       const db =  keyValueDB.current;
       return db.add(tableEnum.PROMPTS, prompts);
    }
    function getAllPrompts(){
        const db = keyValueDB.current;
        return db.get(tableEnum.PROMPTS);
    }

    useEffect(()=>{
        if(firstTime.current)
            firstTime.current = false;
        else
            saveAllPrompts();
            
    },[prompts]);

    useEffect(()=>{
        getAllPrompts()
            .then(res=>{
                if(res){
                    setPrompts(res)
                }
            }).catch(err=>console.error(err));
    },[])
    const onLoad = useCallback(()=>{
        goToLast();
    },[])
    function removeItems(ids){
        const id_set = new Set(ids);
        const newPrompts = prompts.filter(([prompt, id]) => !id_set.has(id));
        const newCollections = collection.filter(([func_name, func_def, id]) => !id_set.has(id));
        setPrompts(newPrompts);
        setCollection(newCollections);
    }
    function getChatReponse([prompt ,id] ){
        const element = (
            <React.Fragment key={id}>
                <Ask query = {prompt}/>
                <Response onLoadComplete={onLoad} prompt={prompt} removeResponse={()=>removeItems([id])} collection={collection} setCollection = {setCollection} responseId= {id}/>
            </React.Fragment>
            )
        return element
    }

    function onSend(prompt){
        const id = nanoid();
        setPrompts([...prompts, [prompt ,id]]);
    }

    return (
        <React.Fragment>
            <div className={styles.home}>
                <div className={styles.wrapper_chat}>
                    <div className={styles.chats} ref = {chatBoxRef} >
                    {
                        prompts.map((prompt , index)=>getChatReponse(prompt))
                    }
                    </div>
                </div>
                <div className={styles.controller}>
                    <SearchBox placeholder="Ask functionality e.g: print hello world" onEnter={onSend} className={styles.SearchBox}/>
                </div>
            </div>
        </React.Fragment>
    )
}

export default DeployPanel
