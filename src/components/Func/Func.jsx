import React, { useEffect,useState } from 'react'
import ModalCustom from '../Modal/Modal';
import Execute from './components/Execute';
import styles from './Func.module.scss'
function Func({func_name, params}) {
    const [modal , setModal] = useState(null)

    function handleExecution(){
        setModal(true);
    }

    return (
    <React.Fragment>
        <div className={styles.Func}>
            <span className={styles.func_name}>
                {func_name}
            </span>
            <div className={styles.executeWrapper}>
                <button onClick={handleExecution} className={styles.execute}>
                    Execute
                </button>
            </div>
        </div>
        <ModalCustom 
            modal = {modal} 
            setModal={setModal} 
            title={
                <span style={{color: 'red',fontWeight: 'bold'}}>{func_name}</span>
            }
        >
            <Execute func={func_name} params={params}/>
        </ModalCustom>
    </React.Fragment>
    )
}

export default Func
