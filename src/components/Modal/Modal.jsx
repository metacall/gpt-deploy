import React from 'react'
import Modal from 'react-modal'
import styles, {closeModal, h2Style, Header} from './Modal.styles'
function ModalCustom({children, modal ,setModal, title,style}) {
  return (
    <Modal
        isOpen={Boolean(modal)}
        // onRequestClose={()=>setModal(false)}
        style={{content:{...styles,...style}}}
    >
      <div style={Header}>
        <div style={h2Style}>{title}</div>
        <div style={closeModal} onClick={()=>setModal(false)}>&times;</div>
      </div>
        {children}
    </Modal>
  )
}

export default ModalCustom
