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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretUp, faCaretDown, faSpinner } from "@fortawesome/free-solid-svg-icons";
import usePLansAvailable from '../../customHooks/usePlansAvailable'
import { LoaderSlider } from '../Loader'
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
  const [isDeploying, setIsDeploying] = useState(false)
  const metacallApi = protocol(metacallToken, metacallBaseUrl);
  const {data: plansAvailable, isLoading: isPlanLoading} = usePLansAvailable(metacallToken)
  const [selectedPlan, setSelectedPlan] = useState("Package")
  const [plansAreShown, setPlansAreShown] = useState(false)
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
  
  useEffect(()=>{
    if(plansAvailable)
      setSelectedPlan(plansAvailable?.[0])
  },[plansAvailable])

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
        
      setIsDeploying(true)
      try{
          const createData = await metacallApi.upload(filename, generatedZipBlob)
          const env = []
          await metacallApi.deploy(createData.id, env, selectedPlan, ResourceType.Package)
          addSuccess('deployed '+file.name+' successfully');
      }catch(err){
          addError(err?.response?.data ?? err.message)
      }
      setIsDeploying(false)
    })

}
  return (
    <React.Fragment>
      <div className={'h-full w-1/4 primary-border p-2 flex flex-col'}>
        <div className='text-base flex font-semibold text-gray-600'>
          <span>STASHED FUNCTIONS </span> 
          <FontAwesomeIcon icon={faSpinner} className={'ml-auto mr-3 animate-spin '+(!isDeploying? 'hidden': '') }/>
        </div>
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
        <div  className= {
                deployable ?
                'bg-black text-white font-bold rounded transition duration-300 ease-in-out mt-3  cursor-pointer ' :
                'bg-gray-300  text-white font-bold rounded mt-3'
          }>
            { 
              !isPlanLoading && Array.isArray(plansAvailable) && deployable &&
              <React.Fragment>
                <div className={'flex items-center justify-center py-2 px-4 '+(plansAreShown ? 'visible': 'hidden')}>
                    <ul>
                      {
                          plansAvailable.map((plan, index)=>{
                            return <li key={index} className={selectedPlan === plan ? 'text-white' : 'text-gray-400'} onClick={()=>setSelectedPlan(plan)}>{plan}</li>
                          })
                      }
                    </ul>
                </div>
                  <hr
                    className={(plansAreShown ? 'visible': 'hidden') }
                  />
              </React.Fragment>
            }
          <div className='flex'>
            <button 
            className={'flex items-center justify-center w-full py-2 px-4 rounded '+ (deployable ? 'bg-black active:bg-slate-700': 'bg-gray-400')}
            onClick={()=>{
              setShowConfirmation({
                message: 'Are you sure you want to deploy these functions?',
                onOk: ()=>{
                  deployItems()
                },
                onCancel: ()=>{}
              })
            }}
            disabled={isPlanLoading || !Array.isArray(plansAvailable) || !deployable}
            >
                  DEPLOY
            </button>

            <button 
              className={'flex items-center  justify-center w-1/4 py-2 px-4 rounded ' + (deployable ? 'bg-black active:bg-slate-700': 'bg-gray-400')}
              disabled={isPlanLoading || !Array.isArray(plansAvailable) || !deployable}
              onClick={()=>setPlansAreShown(!plansAreShown)}
            >
              <FontAwesomeIcon icon={(plansAreShown? faCaretDown : faCaretUp)} />
            </button>
          </div>
        </div>
      </div>
      <Confirm showPrompt={showConfirmation} setShowPrompt={setShowConfirmation}/>
    </React.Fragment>
  )
}

export default StashBox