import React, {useEffect} from 'react';
import styles from './WorkBox.module.scss';
import CodeBox from '../../../components/CodeBox/CodeBox';
import StashBox from '../../../components/StashBox/StashBox';
import { setItems } from '../../../redux/stores/stashes.store';
import { useDispatch, useSelector } from 'react-redux';
import { tableEnum, getModel } from '../../../models';

function WorkBox() {
  const dispatch = useDispatch();
  const {isFullscreen} = useSelector(state=>state.fullscreen)
  const stashedKeysDB = React.useRef(getModel(tableEnum.STASHED_KEYS));
  useEffect(() => {
    const db = stashedKeysDB.current;
    db.get('keys').then(res => dispatch(setItems(res ?? [])))
  }, [dispatch])
  
  return (
    <div className={styles.WorkBox}>
      <CodeBox />
      {
        !isFullscreen &&
        <StashBox />
      }
    </div>
  );
}

export default WorkBox;
