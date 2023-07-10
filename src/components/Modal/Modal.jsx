import React from 'react'
import Modal from 'react-modal'
import styles, {closeModal, h2Style, Header} from './Modal.styles'
import { useEffect } from 'react';
function ModalCustom({children, modal ,setModal, title,style}) {
  const [isOpen, setIsOpen] = React.useState(modal);
  useEffect(()=>{
    if(modal){
      setIsOpen(modal);
      return
    }

    setTimeout(() => {
      setIsOpen(modal);
    }, 100);
  },[modal])

  return (
    <Modal
        isOpen={isOpen}
        // onRequestClose={()=>setModal(false)}
        style={{content:{...styles,...style}}}
        className={'-translate-x-1/2 -translate-y-1/2 outline-none transition-transform '+(modal? 'scale-100': 'scale-0')}
    >
      <div style={Header} className='bg-slate-300 rounded px-4 rounded-b-none'>
        <div style={h2Style} >{title}</div>
        <div style={closeModal} onClick={()=>setModal(false)}>&times;</div>
      </div>
        {children}
    </Modal>
  )
}
export default ModalCustom;
