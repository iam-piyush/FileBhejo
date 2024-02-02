import React from 'react';

export const DonotWorry = () => {
  return (
    <div className='flex text-center justify-center items-center bg-green-200 py-2 px-1 border border-dashed border-green-600 rounded'>
      <p className='font-bold'>Don't Worry!</p>
      <p className='ml-2'>Your files will be automatically deleted from the server after 5 minutes.</p>
    </div>
  );
};
