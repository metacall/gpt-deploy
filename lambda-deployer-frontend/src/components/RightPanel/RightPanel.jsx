import React, { useState, useRef, useEffect } from "react";
import styles from "./RightPanel.module.scss";
import { LoaderSlider} from '../../components/Loader';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleLeft, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
const RightPanel = ({ children, title, isOpen, onClose }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [loading, setLoading] = useState(true);
  const panelRef = useRef(null);

  const handleClose = () => {
    setIsAnimating(true);
    setTimeout(() => {
      onClose();
      setIsAnimating(false);
    }, 300);
  };

  const handleTransitionEnd = (event) => {
    if (event.target === panelRef.current) {
      setIsAnimating(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className={styles.overlay}
          onClick={handleClose}
          data-testid="overlay">
          </div>
      )}
      <div
        className={`${styles.panel} ${isOpen ? styles.open : ""} ${
            isAnimating ? styles.animating : ""
        }`}
        ref={panelRef}
        onTransitionEnd={handleTransitionEnd}
        data-testid="panel"
      >
        <div className={styles.panel_content}>
            <LoaderSlider loading={loading}/>
            <div className={styles.panel_header}>
                <FontAwesomeIcon icon={faArrowLeft} className={styles.goBack} title = {"Go Back"} onClick={onClose}/>
                <h2 className={styles.titleName}>
                  {title}
                </h2>
              <div className={styles.tools}>
              </div>
            </div>

            <div className={styles.panel_body}>
              {children}
            </div>
        </div>
      </div>
    </>
  );
};

export default RightPanel;
