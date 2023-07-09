import React, { useCallback, useEffect, useState } from 'react'
import DragNDrop from '../DragNDrop/DragNDrop'
import JSZip from 'jszip';
import IndentedFileShower from '../FileExplorer/FileExplorer';

const extractZip = async (file) => {
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

function ZipExplorer({initZip}) {
  const [filesData, setFilesData] = useState([]);

  const extractZip = useCallback(async (files)=>{
    let  fileDatas= await Promise.all(files.map(async (file) => {
      const zipsFiles =  await extractZip(file)
      return [file?.name,  zipsFiles]
    }));

    fileDatas = fileDatas.map(([prefix, files])=>{
      const prefixName = prefix.split('.')[0];
      return files.map(([fileName, fileData])=> {
        return [prefixName + '/' + fileName]
      })
    })
    fileDatas = fileDatas.flat()
    const fileNames = fileDatas.map((fileData)=>fileData[0])
    setFilesData([...filesData, ...fileNames])
  },[filesData, setFilesData])

  const addSingleFile = useCallback((files)=>{
    const fileNames = files.map((file)=>file.name)
    setFilesData([...filesData, ...fileNames])
  },[filesData, setFilesData])

  const addFolder = useCallback((files)=>{
    const fileNames = files.map((file)=>file.path)
    setFilesData([...filesData, ...fileNames])
  },[filesData, setFilesData])

  useEffect(()=>{
    if(initZip){
      extractZip([initZip])
    }
  },[initZip, extractZip])  

  useEffect(()=>{
    console.log(filesData)
  },[filesData])
  return (
    <div className='bg-slate-900 h-full'>
      <div className='w-full  flex gap-4 overflow-hidden primary-border box-border place-content-center p-1'>
          <DragNDrop name = {'Drag or Upload Files'} onDrop={addSingleFile}/>
          <DragNDrop name = {'Drag or Upload Folder'} onDrop={addFolder} isFolder/>
          <DragNDrop name = {'Drag or Upload Zip'} onDrop={extractZip}/>
      </div>
      <IndentedFileShower files={filesData}/>
    </div>
  )
}

export default ZipExplorer