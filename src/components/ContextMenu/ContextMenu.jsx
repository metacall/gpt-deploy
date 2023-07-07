import React, { useState, useEffect } from 'react';
import styles from './ContextMenu.module.scss';

const ContextMenu = ({ options, onSelect, title, children=null, controller, setController }) => {
  const [visible, setVisible] = useState(false);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  const handleContextMenu = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if(setController)
      setController(null)
    
    if(visible){
      setVisible(false);
    } else {
      setX(event.clientX);
      setY(event.clientY);
      setVisible(true);
    }
  };

  const handleSelect = (option) => {
    onSelect(option);
    setVisible(false);
  };

  useEffect(()=>{
    if(controller == null)
      return
    
    if(controller){
        setX(controller.x - 80)
        setY(controller.y)
        setVisible(true)
      } else {
        setVisible(false)
      }
  },[controller])

  useEffect(() => {
    const handleClick = () => {
      if(setController)
        setController(null)
      setVisible(false);
    };

    const handleContextMenu = ()=>{
      if(setController)
        setController(null)
      if(visible)
          setVisible(false);
    }
    document.addEventListener('click', handleClick);
    document.addEventListener('contextmenu', handleContextMenu);
    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('contextmenu',handleContextMenu);
    };
  }, [visible, setController]);

  return (
    <div onContextMenu={handleContextMenu} className="contextMenu">
      {children}
      {visible && (
        <div
          className={styles.contextMenu}
          style={{ left: x, top: y }}
          onClick={(event) => event.stopPropagation()}
        >
          {title && <div className={styles.title}>{title}</div>}
          {options.map((option) => (
            <div
              key={option}
              className={styles.option}
              onClick={() => handleSelect(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContextMenu;
