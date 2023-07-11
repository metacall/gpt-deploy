import React from 'react'
import {useDropzone} from 'react-dropzone'

function DragNDrop({onDrop, name, className, isFolder=false }) {
  const {getRootProps, getInputProps, isDragActive, isFileDialogActive} = useDropzone({onDrop})
  
  return (
    <div {...getRootProps()} className={'border-dashed border-2 cursor-pointer box-border w-full text-center p-1 bg-gray-100  '+className + (isDragActive || isFileDialogActive? ' border-blue-500': ' ')}>
      {
        isFolder?
        <input {...getInputProps()} directory="" webkitdirectory="" mozdirectory=""/>
        :
        <input {...getInputProps()} />
      }
      <p className={'text-slate-500 text-xs md:text-sm whitespace-nowrap text-ellipsis'+(isDragActive || isFileDialogActive? 'font-bold':  '' )}>{name}</p>
    </div>
  )
}

export default DragNDrop