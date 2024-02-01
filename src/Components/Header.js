import React from 'react'

import Logo from "../Assets/Logo.svg";

export const Header = () => {
  return (
    <div className='flex items-baseline p-4'>
        <img src={Logo} alt="" style={{height: '55px'}} />
        <h1 className='text-3xl font-bold text-gray-900 pl-1'>FileBhejo</h1>
    </div>
  )
}
