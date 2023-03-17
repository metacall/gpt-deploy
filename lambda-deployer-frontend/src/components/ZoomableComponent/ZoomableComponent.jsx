import React, { useState, useRef, useEffect, forwardRef } from "react";
import styles from "./ZoomableComponent.module.scss";

const ZoomableComponent = forwardRef(({children, className }, ref) => {

  return (
    <div className={styles.ZoomableComponent + " " + className} ref= {ref}>
        <div className={styles.collector}>
            <div className={styles.zoomable}>
                <div className={styles.zoomableContent}>
                    {children}
                </div>
            </div>
        </div>  
    </div>
  );
});

export default ZoomableComponent;
