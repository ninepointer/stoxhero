import React from 'react';

export default function ErrorBoundaryFallback({error}){

  console.log('error.message', error.message)
  return(
    <div>Something went wrong: {error.message}</div>
  )
}