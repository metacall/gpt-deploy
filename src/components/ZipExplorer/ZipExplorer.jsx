import React, { useCallback, useEffect, useState } from 'react'
import DragNDrop from '../DragNDrop/DragNDrop'
import JSZip from 'jszip';
import FileExplorer from '../FileExplorer/FileExplorer';
import TextViewer from '../CodeDisplay/CodeDisplay';

const extractZipFile = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = function () {
        const zip = new JSZip();
        const zipData = reader.result;
        zip.loadAsync(zipData).then((contents) => {
          const extractedFiles = []
          Object.keys(contents.files).forEach((fileName) => {
            const fileData = contents.files[fileName];
            if (!fileData.dir) {
              extractedFiles.push([fileName, fileData])
            }
          });
          resolve(extractedFiles);
        });
      };
      reader.readAsArrayBuffer(file);
  })
};

const readFile = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function () {
      resolve(reader.result);
    };
    reader.readAsText(file);
  })
};

function ZipExplorer({initZip}) {
  const [filesData, setFilesData] = useState([]);
  const [textData, setTextData] = useState(null);
  
  const extractZip = useCallback(async (files)=>{
    
    let  fileDatas= await Promise.all(files.map(async (file) => {
      const zipsFiles =  await extractZipFile(file)
      return [file?.name,  zipsFiles]
    }));

    fileDatas = await Promise.all(fileDatas.map(async([prefix, files])=>{
      const prefixName = prefix.split('.')[0];
      const fileNames = []
      for(let [fileName, fileData] of files){
        const fileText = await fileData.async('text')
        fileNames.push([prefixName + '/' + fileName,fileText])
      }
      return fileNames
    }))

    const mergedData = []
    for(let fileData of fileDatas){
      mergedData.push(...fileData)
    }
    fileDatas = mergedData
    const fileNames = fileDatas.map((fileData)=>fileData)
    setFilesData([...filesData, ...fileNames])
  },[filesData, setFilesData])


  const addSingleFile = useCallback(async (files)=>{
    
    const fileNames = await Promise.all(files.map(async (file)=>[file.name, await readFile(file)]))
    setFilesData([...filesData, ...fileNames])
  },[filesData, setFilesData])

  const addFolder = useCallback(async (files)=>{
    const fileNames = await Promise.all(files.map(async (file)=>[file.path, await readFile(file)]))
    setFilesData([...filesData, ...fileNames])
  },[filesData, setFilesData])

  const onSelect = useCallback((file)=>{
    setTextData(file)
  },[])

  const onClose = useCallback(()=>{
    setTextData(null)
  },[])

  useEffect(()=>{
    if(initZip){
      extractZip([initZip])
    }
  },[])   //eslint-disable-line

  return (
    <div className='bg-slate-900 opacity-80 p-0.5 overflow-auto no-scrollbar flex flex-row h-full primary-border'>
      <div className='bg-slate-900 flex flex-col opacity-80 overflow-auto no-scrollbar flex-1 h-full primary-border'>
        {
          !textData &&
        <div className='w-full flex gap-4 overflow-hidden primary-border box-border place-content-center p-1'>
            <DragNDrop name = {'Drag or Upload Files'} onDrop={addSingleFile}/>
            <DragNDrop name = {'Drag or Upload Folder'} onDrop={addFolder} isFolder/>
            <DragNDrop name = {'Drag or Upload Zip'} onDrop={extractZip}/>
        </div>
        }
          <div className='overflow-hidden h-full'>
            <div className='overflow-hidden h-full'>
            <FileExplorer filesData={filesData} onSelect={onSelect} selectedFile = {textData?.[0]}/>
            </div>
          </div>
      </div>

        <div className={'bg-gray-300 transition-all '+(textData ? 'w-9/12': 'w-0') }>
          {
          textData &&
          <TextViewer text={ textData[1] } fileName={textData[0]} onClose={onClose}/>
          }
        </div>
    </div>
  )
}

export default ZipExplorer
