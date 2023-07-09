import React,{ useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder, faFolderOpen, faFile, faCaretRight, faCaretDown } from '@fortawesome/free-solid-svg-icons';

const FileExplorer = ({ files, onRemove, onRename }) => {
  const [minimizedFolder, setMinimizedFolder] = useState([]);

  const renderFile = (files) => {
    return files.map((file) => <li key={file}>
        <span key={file}>
            <FontAwesomeIcon icon={faFile} className='text-sm mr-2'/>
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
    return <ul>
        {
            
            parentPath &&
            <span className='w-full rounded px-3 mb-2 cursor-default'>     
                { 
                    true ?
                    <React.Fragment>
                        <FontAwesomeIcon icon={minimizedFolder.includes(parentPath) ? faCaretDown :faCaretRight}  className='text-sm mr-2 cursor-pointer' onClick={()=>{
                            if(minimizedFolder.includes(parentPath)){
                                setMinimizedFolder(minimizedFolder.filter((x)=>x!==parentPath))
                            }
                            else
                                setMinimizedFolder([...minimizedFolder,parentPath])
                        }}/>
                        <FontAwesomeIcon icon={faFolderOpen} className='text-sm mr-2'/>
                    </React.Fragment>
                            : 
                        <FontAwesomeIcon icon={faFolder} className='text-sm mr-2'/>
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
                                <li className='ml-5 rounded text-lg'>
                                    {renderFiles(onlyFolders, folderPath)}
                                </li>
                            }
                            {
                            onlyFile.length > 0 && isNotMinimized(onlyFile) &&
                            <li className='ml-5 py-1 text-lg active:brightness-110 hover:brightness-110 bg-slate-800 px-3 border-teal-100 first-of-type:rounded-t last-of-type:rounded-b first:mt-1 last:mb-1' style={{"borderBottomWidth":"0.5px" }}>
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

  return <div className=' p-4 primary-border shadow-md hover:shadow-lg text-white cursor-pointer'>
    {renderFiles(files)}
    </div>;
};

export default FileExplorer;
