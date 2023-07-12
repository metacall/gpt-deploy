import React, { useCallback, useEffect, useState } from 'react';
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
    const onClose = useCallback(()=>{
        setIsOpen(false);
        setSelectedIndex(null);
        setSelectedFunc(null);
    },[])

    const onClickFunction = useCallback((packageNo , funcNo)=>{
        setSelectedIndex([packageNo , funcNo]);
        setIsOpen(true);
    },[])
     
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


    useEffect(()=>{
        if(deployments === null)
            inspect(null , {
                onSuccess: (data) => {
                    dispatch(setDeployments(data));
                }
            });
    },[inspect, setFuncs, deployments, dispatch])

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
                <div className={styles.suggestionsAI}>
                    <span className={styles.try}
                    >
                        <Link to = '/'>
                            Try
                        </Link>
                    </span> our intelligent deployment assistant to deploy your functions.
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
          <LoaderSpinner loading={isDeploymentsLoading} className={styles.LoaderSpinner}/>
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
                    <div className={styles.DeployedFunctionPanel}> 
                    <div className='mr-auto md:text-3xl whitespace-nowrap md:text-center  text-white font-extrabold  px-6 py-4 rounded'>
                        Metacall Deployments
                    </div>
                    {
                        funcs.map((funcData , packageNo)=>{
                            return (
                                <Deployment 
                                    key={packageNo}
                                    funcData={funcData}
                                    onClickFunction={(funcNo)=>onClickFunction(packageNo, funcNo)}
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
