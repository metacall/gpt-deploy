import React, { useEffect, useState } from 'react';
import styles from './SlidingTabs.module.scss';

const SlidingTabs = ({Top , Bottom  }) => {
  const ref= React.useRef(null);
  function handleDividerMouseDown(event) {
      const starting_y_position = event.clientY;
      const current_height = ref.current.clientHeight;
      const handleDividerPositionChange = (event) => {
        const y_position = event.clientY;
        ref.current.style.setProperty("height", `${current_height+ (y_position - starting_y_position)}px`);
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
    ref.current.style.setProperty("height", "50%");
  },[])
  return (
    <div className={styles.container}>
      <div className={styles.top} ref={ref}>
        {Top}
      </div>
      <div className={styles.dividerContainer}
          onMouseDown={handleDividerMouseDown}
        >
      </div>
      <div className={styles.bottom}>
        {Bottom}
      </div>
    </div>
  );
};

export default SlidingTabs;
