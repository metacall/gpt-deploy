import React, { useCallback, useEffect, useState, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { LoaderSpinner } from '../../components/Loader';
import RightPanel from '../../components/RightPanel/RightPanel';
import SlidingTabs from '../../components/SlidingTabs/SlidingTabs';
import dataTypeMapping from '../../constants/dataTypeMapping';
import useFunctionCall from '../../customHooks/useCallFunction';
import useInspect from '../../customHooks/useInspect';
import styles from './DeployedFunctionPanel.module.scss';
import Bottom from './components/Bottom/Bottom';
import Deployment from './components/Deployment/Deployment';
import Top from './components/Top/Top';
import { useNavigate } from 'react-router-dom';
import { setDeployments } from '../../redux/stores/deployments.store';
import { useDropzone } from 'react-dropzone';
import protocol, {ResourceType} from '@metacall/protocol/protocol'
import { metacallBaseUrl } from '../../constants/env';
import { MessageContext } from '../../components/MessageStack/MessageStack';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSpinner } from '@fortawesome/free-solid-svg-icons';
import JSZip from 'jszip';

const deployStatusEnum = {
    IDLE: 'idle',
    PACKAGES: 'getting packages',
    UPLOADING: 'uploading',
    DEPLOYING: 'deploying',
    DEPLOYED: 'deployed',
    FAILED: 'failed'
}

function DeployedFunctionPanel() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { METACALL_TOKEN: metacallToken } = useSelector(state=> state.env)
    const [funcs, setFuncs] = useState([]);
    const {deployments} = useSelector(state=> state.deployments);
    const [isOpen , setIsOpen] = useState(false);
    const [selectedIndex , setSelectedIndex] = useState(null);
    const [selectedFunc, setSelectedFunc] = useState(null);
    const [title , setTitle] = useState('');
    const [funcUrl , setFuncUrl] = useState("");
    const {call , isLoading  } = useFunctionCall();
    const [method , setMethod]  = useState();
    const [output , setOutput] = useState('');
    const {inspect, isLoading:isDeploymentsLoading } = useInspect(metacallToken)
    const [fields , setFields] = useState(null);
    const [outputErrorFlag , setOutputErrorFlag] = useState(false);
    const [deployStatus , setDeployStatus] = useState(deployStatusEnum.IDLE);
    const metacallApi = protocol(metacallToken, metacallBaseUrl);
    const {addError, addSuccess} = useContext(MessageContext);

    const onClose = useCallback(()=>{
        setIsOpen(false);
        setSelectedIndex(null);
        setSelectedFunc(null);
    },[])

    const  deployZip = useCallback(async (zip) => {
    
        setDeployStatus(deployStatusEnum.UPLOADING);
        try {
          const prefix = zip.name.replace('.zip', '');
          setDeployStatus(deployStatusEnum.PACKAGES);
          const packagesAvailable = await metacallApi.listSubscriptions();
          const Plans = Object.keys(packagesAvailable)
          
          if(Plans.length === 0) 
            throw new Error('No Plans available');

          const plan = Plans[0];
          const createData = await metacallApi.upload(prefix, zip);
          setDeployStatus(deployStatusEnum.DEPLOYING);
          const env = [];
          await metacallApi.deploy(createData.id, env, plan, ResourceType.Package);
          addSuccess(`Deployed ${prefix} at ${plan} successfully`);
          setDeployStatus(deployStatusEnum.DEPLOYED);
          callInspect()
        } catch (err) {
          addError(err?.response?.data ?? err.message);
         setDeployStatus(deployStatusEnum.FAILED);
        }

        setTimeout(() => {
            setDeployStatus(deployStatusEnum.IDLE);
            })
      },[addError, addSuccess, metacallApi]) //eslint-disable-line

    const onClickFunction = useCallback((packageNo , funcNo)=>{
        setSelectedIndex([packageNo , funcNo]);
        setIsOpen(true);
    },[])

    const onDrop = useCallback(async (files)=>{
        if(files.length === 0) return addError('No file selected');

        const zipFirst = files[0];
        if(zipFirst.type === "application/x-zip-compressed")
            deployZip(zipFirst);
        else if (zipFirst.path){
            const packageName = zipFirst.path.split('/')[1];
            const zip = new JSZip();
            files.forEach((file)=>{
                const filename = file.path.split('/').splice(2).join('/')
                zip.file(filename , file);
                })

            zip.generateAsync({type:"blob"}).then((blob)=>{
                const zip = new File([blob], `${packageName}.zip` , {type: 'application/x-zip-compressed'})
                // const url = URL.createObjectURL(blob)
                // let a= document.createElement('a')
                // a.download = 'testing-zip.zip'
                // a.href = url
                // a.click()
                deployZip(zip);
            })
        }
    },[addError, deployZip])

    const {getRootProps, getInputProps, isDragActive, isDragAccept} = useDropzone({onDrop})



    useEffect(()=>{
        if(selectedIndex === null) return;

        const currentFunction = funcs[selectedIndex[0]].functions[selectedIndex[1]];
        setFields(currentFunction.params
            .map((param)=>[param.name , dataTypeMapping[param.type.id]??'string' , ""])) ;
        setTitle(currentFunction.name);
        setSelectedFunc(currentFunction);
        setMethod(currentFunction.params.length === 0 ? 'GET' : 'POST');
        if(currentFunction.lang === 'file')
            setFuncUrl(`https://api.metacall.io/${funcs[selectedIndex[0]].prefix}/${funcs[selectedIndex[0]].suffix}/v1/static/${currentFunction.name}`);
        else
        setFuncUrl(`https://api.metacall.io/${funcs[selectedIndex[0]].prefix}/${funcs[selectedIndex[0]].suffix}/v1/call/${currentFunction.name}`);
    },[selectedIndex,funcs ])

    const callInspect = useCallback(()=>{
        inspect(null , {
            onSuccess: (data) => {
                dispatch(setDeployments(data));
            }
        });
    },[inspect, dispatch])

    useEffect(()=>{
        if(deployments === null)
            callInspect()
    },[callInspect,deployments])

    useEffect(()=>{
        if(deployments === null) return;
        setFuncs(deployments);
    },[deployments])

    function getNoDeployment(){
        return (
            <div className={styles.NoDeployment}>
                <div className={styles.NoDeploymentText }>
                    No Deployments Found
                </div>
                <div className={styles.suggestionsAI} >
                    <div>
                        <span className={styles.try}
                        >
                            <Link to = '/'>
                                Try 
                            </Link> 
                        </span> our intelligent deployment assistant to deploy your functions.
                    </div>
                    <div className='text-center text-sm md:text-base md:m-5 md:p-5 cursor-pointer ' {...getRootProps()} style={{border: isDragActive? '5px dashed green':'5px dashed gray'}}>
                        <input {...getInputProps()} />
                        {
                            isDragAccept?
                             <FontAwesomeIcon icon={faPlus} size='3x' color='green' />
                            :
                            <p>Drop folder/zip or Click to deploy package</p>
                        }
                    </div>
                </div>
            </div>
        )
    }
    const onCall = ()=>{
        const data = {};
        fields.forEach((field)=>{
            data[field[0]] = field[2];
        })
        call({
            url: selectedFunc.lang === 'file'? 
                `/api/getStaticFile/${funcs[selectedIndex[0]].prefix}/${funcs[selectedIndex[0]].suffix}/${funcs[selectedIndex[0]].functions[selectedIndex[1]].name}` : funcUrl,
            method,
            data
        }, {
            onSuccess: (data) => {
                setOutput(data.trim() ?? '<No Output>');
                setOutputErrorFlag(false)
            },
            onError: (error) => {
                if(selectedFunc.lang === 'file')
                    setOutput("Sorry! cannot open the file as it is hindered by cors policy")
                else
                    setOutput(error.message)
                setOutputErrorFlag(true)
            }
        });
    }

    function fieldManger(arr){
        setFields(arr);
    }

    if(!metacallToken){
        navigate('/')
    }

    return (
        <React.Fragment>
          <LoaderSpinner loading={isDeploymentsLoading && (deployments === null)} className={styles.LoaderSpinner}/>
          {
            !isDeploymentsLoading && funcs.length === 0 
            ? getNoDeployment()
            :
            !isDeploymentsLoading && <React.Fragment>
                <RightPanel isOpen={isOpen} title={title} onClose={onClose} loading={isLoading}>
                    {
                        <SlidingTabs 
                            Top = {<Top
                                funcName= { title}
                                funcUrl = {funcUrl}
                                method = {method}
                                onCall = {onCall}
                                fields = {fields}
                                setFields = {fieldManger}
                                loading = {isLoading}
                            />} 
                            Bottom = {<Bottom
                                        title={'Output'}
                                        content={output}
                                        isJson = {true}
                                        setContent = {setOutput}
                                        errorFlag = {outputErrorFlag}
                                        setErrorFlag = {setOutputErrorFlag}
                                        />}/>
                    
                    }
                </RightPanel>
                    <div className={styles.DeployedFunctionPanel} style={{border: isDragActive? '5px dashed gray':'none'}}
                    {...getRootProps()}
                    > 
                    <div className='mr-auto w-full flex md:text-3xl whitespace-nowrap md:text-center  text-white font-extrabold  px-6 py-4 rounded'>
                        <div >Metacall Deployments</div>
                        <div className={'ml-auto mr-3  opacity-0 '+(([deployStatusEnum.DEPLOYING, deployStatus.UPLOADING].includes(deployStatus)) ? "opacity-100" : "")}
                        >
                            <span> {deployStatus} </span>
                            <FontAwesomeIcon icon={faSpinner}  className={
                            " animate-spin " 
                            
                        }/> </div>
                    </div>
                    {
                        funcs.map((funcData , packageNo)=>{
                            return (
                                <Deployment 
                                    key={packageNo}
                                    funcData={funcData}
                                    onClickFunction={(funcNo)=>onClickFunction(packageNo, funcNo)}
                                    afterRemove={callInspect}
                                    />
                            )
                        })
                    }
                    </div>
            </React.Fragment>
        }
        </React.Fragment>
    )
}

export default DeployedFunctionPanel
