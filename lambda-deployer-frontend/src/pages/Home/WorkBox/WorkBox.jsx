import React from 'react';
import styles from './WorkBox.module.scss';
import CodeBox from '../../../components/CodeBox/CodeBox';
import StashBox from '../../../components/StashBox/StashBox';
function WorkBox() {
  return (
    <div className={styles.WorkBox}>
      <CodeBox />
      <StashBox />
    </div>
  );
}

export default WorkBox;
