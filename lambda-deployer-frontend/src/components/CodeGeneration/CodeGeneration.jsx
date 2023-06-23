import React,{useState,useRef , useEffect} from 'react'
import JSZip from 'jszip';
import axios from 'axios'
import Ask from '../../components/Ask/Ask'
import { nanoid } from 'nanoid';
import Response from '../../components/Response/Response'
import {useSelector , useDispatch} from 'react-redux'
import { setPrompts as updatePrompts } from '../../redux/stores/prompts.store';
import { getModel , tableEnum } from '../../models';
import StashBox from '../StashBox/StashBox';
const defaultPrompts = ["take two strings as parameter and return contatenation of them in upper case",
                        "return object passed in parameter", 
                        "add two number",
                        "return the sum of all numbers in an array"]

function CodeGeneration({newPrompt}) {
    const randomPrompt = defaultPrompts[Math.floor(Math.random() * defaultPrompts.length)]
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

    // useEffect(()=>{
    //     if(prompts.length == 0 ){
    //         onSend(randomPrompt);
    //     }
    // },[])

    function deployItems(ids){
        const id_set = new Set(ids);
        const deployFunc = collection.filter(([func_name, func_def, id]) => id_set.has(id));

        if(deployFunc.length ===0)
           return alert("No function selected ")
        
        const zip =new JSZip();
        const jsFolder = zip.folder('js');
        const filename = deployFunc.map(([func_name])=>func_name.split('_').join('-')).join("-");
        const content = deployFunc.map(([func_name,func_def])=>"module.exports."+ func_def).join("\n\n");
        const file = new File([content], `${filename}.js`,{type: "text/plain"});
        jsFolder.file(file.name, file);
        const metacall_json = JSON.stringify({
            language_id : "node",
            path:"./js",
            scripts:[file.name]
        })
        const metacall_json_file = new File([metacall_json], "metacall-node.json",{type: "text/plain"})
        zip.file("metacall-node.json", metacall_json_file );
        zip.generateAsync({type:"blob",
                            mimeType: 'application/zip'
                        }).then(async(generatedZipBlob)=>{
            const generatedZipFile = new File([generatedZipBlob], `${filename}.zip`,{type: generatedZipBlob.type});
            const fd = new FormData();
            fd.append("jsons",JSON.stringify([]));
            fd.append("raw",generatedZipFile);
            fd.append("id",filename);
            fd.append('type', 'application/zip');
            fd.append("runners",JSON.stringify([]));
            
            try{
                const createData = await axios.post(`/api/create`,fd,{
                    headers: {
                      'Content-Type': 'multipart/form-data'
                    }
                  }).then(res=>res.data.response_data);
                console.log(createData)
                let data = await axios.post(`/api/deploy` , {
                    name : createData.id
                }).then(res=>res.data);
                alert('deployed '+file.name+' successfully');
            }catch(err){
                alert(err.message)
            }
        })

    }
    return (
        <React.Fragment>
            <div className='overflow-auto no-scrollbar' ref={chatBoxRef}>
                {
                    prompts.map((prompt , index)=>getChatReponse(prompt))
                }
            </div>
            {/* <SelectionBox selections={collection.map(([func_name, _ , id])=>[func_name , id])} 
                    title={"Selected Functions"} 
                    removeItems={removeItems}
                    deployItems= {deployItems}
                    /> */}
        </React.Fragment>
    )
}

export default CodeGeneration
