import React from 'react'

import Logo from "../Assets/Logo.svg";

export const Header = () => {
  return (
    <div className='flex items-baseline lg:py-12 md:py-8 sm:py-4 max-[640px]:p-4'>
        <img src={Logo} alt="" style={{height: '55px'}} />
        <h1 className='text-3xl font-bold text-gray-900 pl-1'>FileBhejo</h1>
    </div>
  )
}
