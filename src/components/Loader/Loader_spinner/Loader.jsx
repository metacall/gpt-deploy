import React, { useEffect, useRef } from 'react'
import styles from './Loader.module.scss'
function Loader({height="" , width= "", className, loading}) {
    const ref = useRef();
    useEffect(()=>{
        if(loading){
            ref.current.style.setProperty('display','grid');
            ref.current.style.setProperty('opacity',1);
        } else {
            ref.current.style.setProperty('opacity',0);
        }
    },[loading])

    function onTransitionEnd(){
        if(!loading){
            ref.current.style.setProperty('display','none');            
        }
            
    }
    return (
        <div className={className+ ' '+ styles.loader} style={{height, width}} ref={ref}
        onTransitionEnd={onTransitionEnd}>
            <img src= {"./logo-animated.svg"} className={styles.loaderImage} alt = 'logo-animated'/>
        </div>
    )
}

export default Loader
