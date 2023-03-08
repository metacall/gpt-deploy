import React, { useState } from 'react'
import {Tabs, TabList,TabPanel, Tab} from 'react-tabs'
import styles from './Notebook.module.scss'
function Notebook({Selectors,Panels}) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    return (
        <Tabs selectedIndex={selectedIndex} onSelect={ind=>setSelectedIndex(ind)} className={styles.Tabs}>
        <TabList className={styles.TabList}>
          {
            Selectors.map((selector,index)=>{
              return <Tab key={index} className={index === selectedIndex ? styles["Tab-Selected"]+" "+styles.Tab : styles.Tab}>{selector}</Tab>
            })
          }
        </TabList>
          
        {
          Panels.map((panel,index)=>{
            return <TabPanel key={index} className={styles.TabPanel}>{panel}</TabPanel>
          }
          )
        }
      </Tabs>
    );
}

export default Notebook
