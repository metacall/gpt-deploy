import React from 'react'
function Header() {
  return (
      <div className='bg-white pl-2' >
          <img src="./logo.png" alt="logo" className='h-12 cursor-pointer' onClick={()=>window.open("https://hub.metacall.io","_new")}/>
      </div>
  )
}

export default Header;
