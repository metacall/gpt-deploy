import React, { useState, useEffect } from 'react';
import styles from './ContextMenu.module.scss';

const ContextMenu = ({ options, onSelect, title, children=null }) => {
  const [visible, setVisible] = useState(false);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  const handleContextMenu = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setVisible(true);
    setX(event.clientX);
    setY(event.clientY);
  };

  const handleSelect = (option) => {
    onSelect(option);
    setVisible(false);
  };

  useEffect(() => {
    const handleClick = () => {
      setVisible(false);
    };

    const handleContextMenu = ()=>{
        if(visible)
            setVisible(false);
    }
    document.addEventListener('click', handleClick);
    document.addEventListener('contextmenu', handleContextMenu);
    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('contextmenu',handleContextMenu);
    };
  }, []);

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
