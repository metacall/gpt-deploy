import React from 'react'
import logo from './logoSmall.png'
function Header() {
  return (
      <div className='bg-white pl-2' >
          <img src={logo} alt="logo" className='h-12 cursor-pointer' onClick={()=>window.open("https://hub.metacall.io","_new")}/>
      </div>
  )
}

export default Header;
