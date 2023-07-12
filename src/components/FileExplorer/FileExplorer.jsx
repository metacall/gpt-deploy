import React,{ useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder, faFolderOpen, faFile, faCaretRight, faCaretDown } from '@fortawesome/free-solid-svg-icons';

const FileExplorer = ({ filesData, onRemove, onRename, onSelect }) => {
  const [minimizedFolder, setMinimizedFolder] = useState([]);
  const fileToData = Object.fromEntries(filesData);
const files = Object.keys(fileToData);
  const renderFile = (files) => {
    return files.map((file) => <li key={file} onClick={()=>onSelect([file, fileToData[file]])}>
        <span key={file}>
            <FontAwesomeIcon icon={faFile} className='text-xs mr-2'/>
            {file.split('/').pop()}
        </span>
        </li>
    )
  };

  const isNotMinimized = (folderPaths) => {
    for(let fp of folderPaths){
        for(let mm of minimizedFolder){
            if(fp.startsWith(mm) && fp!==mm){
                return false;
            }
        }
    }
    return true
  }

  const renderFiles = (files, parentPath = '') => {
    files.sort();
    const nestedFiles = files.map((file) => file.replace(parentPath, ''));
    const uniqueFolders = [...new Set(nestedFiles.map((file) => file.split('/')[0]))];
    const currentFolder = parentPath.split('/').filter((x) => x).pop();
    if(!isNotMinimized([parentPath]))
        return null
    return <ul className='relative'>
        {
            
            parentPath &&
            <span className={'w-full sticky rounded text-sm mb-2 cursor-default '}>     
                { 
                    true ?
                    <React.Fragment>
                        <FontAwesomeIcon icon={minimizedFolder.includes(parentPath) ? faCaretDown :faCaretRight}  className='text-xs mr-2 cursor-pointer' onClick={()=>{
                            if(minimizedFolder.includes(parentPath)){
                                setMinimizedFolder(minimizedFolder.filter((x)=>x!==parentPath))
                            }
                            else
                                setMinimizedFolder([...minimizedFolder,parentPath])
                        }}/>
                        <FontAwesomeIcon icon={faFolderOpen} className='text-xs mr-2'/>
                    </React.Fragment>
                            : 
                        <FontAwesomeIcon icon={faFolder} className='text-xs mr-2'/>
                }
                    {currentFolder} 
            </span>
        }
            {
                <React.Fragment>
                {
                uniqueFolders.map((folder) => {
                    const folderPath = `${parentPath}${folder}/`;
                    const onlyFile = files.filter((file) => file+'/' === folderPath );
                    const onlyFolders = files.filter((file) => file.startsWith(folderPath));
                    return (
                        <React.Fragment>
                            {   

                                onlyFolders.length > 0 && 
                                <li className='ml-2 sticky rounded text-sm'>
                                    {renderFiles(onlyFolders, folderPath)}
                                </li>
                            }
                            {
                            onlyFile.length > 0 && isNotMinimized(onlyFile) &&
                            <li className={'ml-2 whitespace-nowrap py-1 text-sm overflow-auto no-scrollbar active:brightness-125 hover:brightness-110 bg-slate-800 px-2 border-teal-100 first-of-type:rounded-t last-of-type:rounded-b first:mt-1 last:mb-1 border-bottom-vsm' }>
                                {renderFile(onlyFile)}
                            </li>
                            }
                        </React.Fragment>
                    )
                    
                })
                }
                </React.Fragment>
            }
        </ul>

  };

  return (
    <div className='h-full overflow-auto no-scrollbar p-2'>
        <div className='h-full relative no-scrollbar overflow-auto shadow-md hover:shadow-lg text-gray-100 cursor-pointer'>
            {renderFiles(files)}
        </div>
    </div>
  )
};

export default FileExplorer;
