import { AlertCircleIcon } from 'lucide-react'
import React from 'react'

export default function Alert({msg}) {
  return (
    <div className='bg-red-300 px-2 py-3 mt-3 rounded-md flex items-center'>
        <AlertCircleIcon className='mr-1' />
        {msg}
    </div>
  )
}
