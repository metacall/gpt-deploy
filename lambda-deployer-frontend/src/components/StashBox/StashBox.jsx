import React, {useContext} from 'react'
import styles from './StashBox.module.scss'
import {useSelector, useDispatch} from 'react-redux'
import StashList from '../StashList/StashList'
import { removeItem } from '../../redux/stores/stashes.store'
import JSZip from 'jszip'
import protocol, {ResourceType} from '@metacall/protocol/protocol'
import { Plans } from '@metacall/protocol/plan'
import { MessageContext } from '../MessageStack/MessageStack'
function StashBox({}) {
  const {addError, addSuccess} = useContext(MessageContext)
  const dispatch = useDispatch();
  const {collection} = useSelector(state => state.stashes);
  const metacallToken = useSelector(state => state.env.METACALL_TOKEN)
  const deployable = collection.length > 0 && metacallToken !== '';
  const metacallBaseUrl = 'https://dashboard.metacall.io'
  console.log(protocol)
  const metacallApi = protocol(metacallToken, metacallBaseUrl)
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
            const deployData = await metacallApi.deploy(createData.id, env, Plans.Standard, ResourceType.Package)
            addSuccess('deployed '+file.name+' successfully');
        }catch(err){
            addError(err?.response?.data ?? err.message)
        }
    })

}
  return (
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
      onClick={deployItems}
      disabled={!deployable}>
            DEPLOY
       </button>
    </div>
  )
}

export default StashBox
