import React,{useState,useRef , useEffect} from 'react'
import Ask from '../../components/Ask/Ask'
import Response from '../../components/Response/Response'
import {useSelector , useDispatch} from 'react-redux'
import { setPrompts as updatePrompts } from '../../redux/stores/prompts.store';
import { getModel , tableEnum } from '../../models';

function CodeGeneration() {
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
    function onLoad(){
        goToLast();
    }
    function removeItems(ids){
        const id_set = new Set(ids);
        const newPrompts = prompts.filter(([prompt, id]) => !id_set.has(id));
        const newCollections = collection.filter(([func_name, func_def, id]) => !id_set.has(id));
        setPrompts(newPrompts);
        setCollection(newCollections);
    }
    function getChatReponse([prompt ,id, metadata] ){
        const element = (
            <React.Fragment key={id}>
                <Ask query = {prompt} timestamp={metadata.timestamp}/>
                <Response onLoadComplete={onLoad} prompt={prompt} removeResponse={()=>removeItems([id])} collection={collection} setCollection = {setCollection} responseId= {id}/>
            </React.Fragment>
            )
        return element
    }

    return (
        <React.Fragment>
            <div className='overflow-auto no-scrollbar' ref={chatBoxRef}>
                {
                    prompts.map((prompt , index)=>getChatReponse(prompt))
                }
            </div>
        </React.Fragment>
    )
}

export default CodeGeneration
