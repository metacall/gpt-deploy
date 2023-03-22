import React, { useEffect, useState } from 'react';
import styles from './SlidingTabs.module.scss';

const SlidingTabs = ({Top , Bottom  }) => {
  const ref= React.useRef(null);
  const refbottom= React.useRef(null);
  function handleDividerMouseDown(event) {
      const starting_y_position = event.clientY;
      const current_height = ref.current.clientHeight;
      const handleDividerPositionChange = (event) => {
        const y_position = event.clientY;
        ref.current.style.setProperty("height", `${current_height+ (y_position - starting_y_position)}px`);
        refbottom.current.style.setProperty("height", `calc(100% - ${current_height+ (y_position - starting_y_position)}px - 50px)`);
      };
    
      function handleDividerMouseUp(event) {
          document.removeEventListener('mousemove', handleDividerPositionChange);
          document.removeEventListener('mouseup', handleDividerMouseUp);
      }
      event.preventDefault()
      event.stopPropagation();
      document.addEventListener('mousemove', handleDividerPositionChange);
      document.addEventListener('mouseup', handleDividerMouseUp);
  }

  useEffect(()=>{
    ref.current.style.setProperty("height", "60%");
    refbottom.current.style.setProperty("height", "calc(40% - 50px)");
  },[])
  return (
    <div className={styles.container}>
      <div className={styles.top} ref={ref}>
        {Top}
      </div>
      <div className={styles.dividerContainer}
          onMouseDown={handleDividerMouseDown}
        >
          <hr/>
      </div>
      <div className={styles.bottom} ref = {refbottom}>
        {Bottom}
      </div>
    </div>
  );
};

export default SlidingTabs;
