import React,{useState,useRef , useEffect} from 'react'
import JSZip from 'jszip';
import axios from 'axios';
import Ask from '../../components/Ask/Ask'
import { nanoid } from 'nanoid';
import Response from '../../components/Response/Response'
import SearchBox from '../../components/SearchBox/SearchBox'
import styles from './DeployPanel.module.scss'
import SelectionBox from '../../components/SelectionBox/SelectionBox';
const defaultPrompts = ["take two strings as parameter and return contatenation of them in upper case",
                        "return object passed in parameter", 
                        "add two number",
                        "return the sum of all numbers in an array"]
function DeployPanel({prompts, setPrompts}) {
    const randomPrompt = defaultPrompts[Math.floor(Math.random() * defaultPrompts.length)]
    const chatBoxRef = React.useRef(null)
    const [collection, setCollection] = useState([]);
    function goToLast(){
        setTimeout(()=>{
            const messageBody = chatBoxRef.current;
            messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
        }, 100)
    }

    function onLoad(func_name,func_id){
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
    
    useEffect(()=>{
        if(!prompts.length)
            onSend(randomPrompt);
    },[])


    function deployItems(ids){
        const id_set = new Set(ids);
        const deployFunc = collection.filter(([func_name, func_def, id]) => id_set.has(id));

        if(deployFunc.length ===0)
           return alert("No function selected ")
        
        const zip =new JSZip();
        const jsFolder = zip.folder('js');
        const filename = deployFunc.map(([func_name])=>func_name).join("_");
        const content = deployFunc.map(([func_name,func_def])=>"module.exports."+ func_def).join("\n\n");
        console.log(content);
        const file = new File([content], `${filename}.js`,{type: "text/plain"});
        jsFolder.file(file.name, file);
        const metacall_json = JSON.stringify([{
            language_id : "node",
            path:"./js",
            scripts:[file.name]
        }])

        zip.generateAsync({type:"blob",
                            mimeType: 'application/zip-x-compress'
                        }).then(async(generatedZipFile)=>{
            const fd = new FormData();
            fd.append("jsons",metacall_json);
            fd.append("blob",generatedZipFile,file.name);
            fd.append("name",file.name);
            fd.append("runners",JSON.stringify(["node"]));
            try{
                const create_response = await axios.post(`/api/create`,fd).then(res=>res.data);
                let data = await axios.post(`/api/deploy`).then(res=>res.data);
                localStorage.setItem("suffix",data.suffix);
                alert('deployed '+file.name+' successfully');
            }catch(err){
                alert(err.message)
            }
        })

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
            <SelectionBox selections={collection.map(([func_name, _ , id])=>[func_name , id])} 
                    title={"Selected Functions"} 
                    removeItems={removeItems}
                    deployItems= {deployItems}
                    />
        </React.Fragment>
    )
}

export default DeployPanel
