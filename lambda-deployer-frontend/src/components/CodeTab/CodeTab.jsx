import React, { useCallback, useEffect, useState } from 'react'
import {Tabs, TabList,TabPanel, Tab} from 'react-tabs'
import styles from './CodeTab.module.scss'
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TabButton from './components/TabButton/TabButton';
import Prompt from '../PromptBox/Prompt';
import Confirm from '../Confirm/Confirm';
function CodeTab({Selectors, addTabsName, renameTabFromId, closeTabFromId, selectedIndex, setSelectedIndex,  Panels}) {
    const [addMorePrompt, setAddMorePrompt] = useState(false);
    const [confirmData, setConfirmData] = useState(false);
    const onOk = useCallback((value)=>{
      addTabsName(value)
    },[addTabsName])

    const onCancel = useCallback(()=>{
        setAddMorePrompt(false)
    },[setAddMorePrompt])

    function closeTab(id = Selectors[selectedIndex][1]){
      const name = Selectors.filter(([selector, sid])=>sid === id)[0][0]
      setConfirmData(
        {
          message: `Are you sure you want to close ${name} tab?`,
          onOk: ()=>{
            closeTabFromId(id)
            setConfirmData(false)
          },
          onCancel: ()=>{
            setConfirmData(false)
          } 
        }
      )
    }

    function addTab(){
      setAddMorePrompt({
        onOk,
        onCancel,
        message: "Enter file name",
      })
    }


    function handleKeyDown(e){
      e.stopPropagation();
      if(e.altKey && e.key === "w"){
        closeTab()
      }
      else if(e.altKey && e.key === "n"){
        addTab()
      }
    }

    useEffect(()=>{

      window.addEventListener("keydown", handleKeyDown)

      return ()=>{
        window.removeEventListener("keydown", handleKeyDown)
      }
    })

    return (
      <React.Fragment>
          <Tabs selectedIndex={selectedIndex} onSelect={ind=>setSelectedIndex(ind)} className={styles.Tabs}>
            <div className={styles.TabListWrapper}>
              <TabList className={styles.TabList}>
                {
                  Selectors.map(([selector, id],index)=>{
                    return <Tab key={index} className={index === selectedIndex ? styles["Tab-Selected"]+" "+styles.Tab : styles.Tab}
                        style={{
                          borderLeft: index-1 === selectedIndex ?"brown" : index===0 ?"none":"",
                        }}>
                          <TabButton name={selector} 
                            isSelected = {index === selectedIndex} 
                            handleClose={()=>closeTab(id)}
                            rename = {(value)=>renameTabFromId(id, value)}
                            />
                      </Tab>
                  })
                }
              <div className={styles.addButtonWrapper} 
                  onClick={
                    addTab
                  }
                  >
                <FontAwesomeIcon icon={faPlus} className={styles.addButton}/>
              </div>
              </TabList>
          </div>
          
          {
            Panels.map((panel,index)=>{
              return <TabPanel key={index} className={styles.TabPanel}>{panel}</TabPanel>
            }
            )
          }
        </Tabs>
        <Prompt showPrompt={addMorePrompt} setShowPrompt={setAddMorePrompt}/>
        <Confirm showPrompt={confirmData} setShowPrompt={setConfirmData}/>
      </React.Fragment>
    );
}

export default CodeTab
