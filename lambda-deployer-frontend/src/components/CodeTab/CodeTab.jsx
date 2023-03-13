import React, { useCallback, useState } from 'react'
import {Tabs, TabList,TabPanel, Tab} from 'react-tabs'
import styles from './CodeTab.module.scss'
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TabButton from './components/TabButton/TabButton';
import Prompt from '../PromptBox/Prompt';
function CodeTab({Selectors, addTabsName, closeTabFromId, selectedIndex, setSelectedIndex,  Panels}) {
    const [addMorePrompt, setAddMorePrompt] = useState(false);
    const onOk = useCallback((value)=>{
      addTabsName(value)
    },[addTabsName])

    const onCancel = useCallback(()=>{
        setAddMorePrompt(false)
    },[setAddMorePrompt])

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
                            handleClose={()=>closeTabFromId(id)}/>
                      </Tab>
                  })
                }
              <div className={styles.addButtonWrapper} 
                  onClick={
                    ()=> setAddMorePrompt({
                      onOk,
                      onCancel,
                      message: "Enter file name",

                    })
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
      </React.Fragment>
    );
}

export default CodeTab
