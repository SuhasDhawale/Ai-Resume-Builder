import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'

function EditResume() {
    const params=useParams();

    useEffect(()=>{
        console.log(params.resumeId)
    },[])
  return (
    <div className='grid grid-col-1 md:grid-cols-2 p-10 gap-10'>
      

    </div>
  )
}

export default EditResume