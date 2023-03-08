import React, { useState, useRef, useEffect } from 'react';
import styles from './Confirm.module.scss';

const Confirm = ({showPrompt, setShowPrompt }) => {

  const [inputValue, setInputValue] = useState('');
  const promptRef = useRef(null);

  useEffect(()=>{
    if(showPrompt){
      promptRef.current.style.top='0';
    } else {
      promptRef.current.style.top='-500px';
    }
  },[showPrompt])

  const handleOk = () => {
    setTimeout(()=>setShowPrompt(false) , 400) ;
    showPrompt.onOk(inputValue);
  };

  const handleCancel = () => {
    if(!promptRef.current)
      return
    promptRef.current.style.top='-500px';
    setTimeout(()=>setShowPrompt(false) , 400) ;
    showPrompt.onCancel(null);
  };

  const handleOutsideClick = (e) => {
    if(!promptRef.current)
      return
    if (!promptRef.current.contains(e.target)) {
      handleCancel();
    }
  };

  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      handleCancel();
    }
  };

  useEffect(() => {
    if(!showPrompt) return;

    promptRef.current.style.top = '0';
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);
  

  return (
    <React.Fragment>
        <div className={styles.prompt} ref={promptRef}>
          <div className={styles.promptBox} >
            <div className={styles.promptMessage}>{showPrompt?.message}</div>
            <div className={styles.promptButtons}>
              <button className={styles.promptButton} onClick={handleOk}>
                Confirm
              </button>
              <button className={styles.promptButton} onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </div>
        </div>
    </React.Fragment>
  );
};

export default Confirm;
