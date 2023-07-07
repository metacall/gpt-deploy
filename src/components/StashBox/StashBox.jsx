import React, {useContext, useState, useRef, useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import StashList from '../StashList/StashList'
import JSZip from 'jszip'
import protocol, {ResourceType} from '@metacall/protocol/protocol'
import { Plans } from '@metacall/protocol/plan'
import { MessageContext } from '../MessageStack/MessageStack'
import { metacallBaseUrl } from '../../constants/URLs'
import Confirm from '../Confirm/Confirm'
import { getModel, tableEnum } from '../../models';
import { setItems } from '../../redux/stores/stashes.store'
function StashBox() {
  const dispatch = useDispatch()
  const stashedKeysDB = useRef(getModel(tableEnum.STASHED_KEYS))
  const {addError, addSuccess} = useContext(MessageContext)
  const {stashedKeys} = useSelector(state => state.stashes);
  const keyValueDB = useRef(getModel(tableEnum.RESPONSES));
  const [showConfirmation , setShowConfirmation] = useState(false)
  const metacallToken = useSelector(state => state.env.METACALL_TOKEN)
  const [collection, setCollection] = useState([]);
  const deployable = stashedKeys.length > 0 && metacallToken !== '';
  const metacallApi = protocol(metacallToken, metacallBaseUrl);
  
  useEffect(()=>{
    stashedKeysDB.current.get('keys').then((keys)=>{
        dispatch(setItems(keys ?? []))
    })
  },[dispatch])

  useEffect(()=>{
    
    async function getResponses(){
      const responses = await Promise.all(stashedKeys.map(async(key)=>{
        const response = await keyValueDB.current.get(key)
        return [response, key]
      }))
      setCollection(responses)
    }
    getResponses()
  },[stashedKeys])
  
  async function deployItems(){
    if(collection.length ===0)
       return alert("No function selected ")

    const zip =new JSZip();
    const filename = collection.map(([{name}])=>name.split('_').join('-')).join("-");
    const content = collection.map(([{function_def}])=>"module.exports."+ function_def).join("\n\n");
    const file = new File([content], `${filename}.js`,{type: "text/plain"});
    zip.file(file.name, file);
    const metacall_json = JSON.stringify({
        language_id : "node",
        path:".",
        scripts:[file.name]
    })
    const metacall_json_file = new File([metacall_json], "metacall.json",{type: "text/plain"})
    zip.file(metacall_json_file.name, metacall_json_file );

    zip.generateAsync({type:"blob",
                        mimeType: 'application/x-zip-compressed'
                    }).then(async(generatedZipBlob)=>{
        
        try{

            const createData = await metacallApi.upload(filename, generatedZipBlob)
            const env = []
            await metacallApi.deploy(createData.id, env, Plans.Standard, ResourceType.Package)
            addSuccess('deployed '+file.name+' successfully');
        }catch(err){
            addError(err?.response?.data ?? err.message)
        }
    })

}
  return (
    <React.Fragment>
      <div className={'h-full w-1/4 primary-border p-2 flex flex-col'}>
        <p className='text-base font-semibold text-gray-600'>
          STASHED FUNCTIONS
        </p>
        {
          !deployable ? (
              <p className='text-gray-400 text-xs mt-3 mb-3'>
                  Generate functions and add them to deploy
              </p>
          ) : (
              null
          )
        }
      
      <StashList fnList={collection}/>
        
        <button 
        className= {
              deployable ?
              'bg-black text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out mt-3 active:bg-slate-700 cursor-pointer' :
              'bg-gray-300  text-white font-bold py-2 px-4 rounded mt-3'
        }
        onClick={()=>{
          setShowConfirmation({
            message: 'Are you sure you want to deploy these functions?',
            onOk: ()=>{
              deployItems()
            },
            onCancel: ()=>{}
          })
        }}
        disabled={!deployable}>
              DEPLOY
        </button>
      </div>
      <Confirm showPrompt={showConfirmation} setShowPrompt={setShowConfirmation}/>
    </React.Fragment>
  )
}

export default StashBox
