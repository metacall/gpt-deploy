import React, { useState } from 'react';
import JSZip from 'jszip';
import { useDropzone } from 'react-dropzone';

const ZipExplorer = () => {
  const [files, setFiles] = useState([]);

  const handleFileDelete = (fileName) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
  };

  const handleFileMove = (fileName, targetFolder) => {
    setFiles((prevFiles) =>
      prevFiles.map((file) => {
        if (file.name === fileName) {
          return {
            ...file,
            folder: targetFolder,
          };
        }
        return file;
      })
    );
  };

  const extractZip = (file) => {
    const reader = new FileReader();
    reader.onload = function () {
      const zip = new JSZip();
      const zipData = reader.result;
      zip.loadAsync(zipData).then((contents) => {
        const extractedFiles = Object.keys(contents.files).map((fileName) => {
          const fileData = contents.files[fileName];
          if (!fileData.dir) {
            return {
              name: fileName,
              isFolder: false,
              data: fileData,
            };
          }
          return null;
        });
        setFiles((prevFiles) => [
          ...prevFiles,
          ...extractedFiles.filter((extractedFile) => extractedFile !== null),
        ]);
      });
    };
    reader.readAsArrayBuffer(file);
  };

  const handleDrop = (acceptedFiles) => {
    const uploadFiles = acceptedFiles.map((file) => {
      if (file.type === 'application/zip') {
        extractZip(file);
        return null;
      }
      return {
        name: file.webkitRelativePath || file.name,
        isFolder: file.isDirectory,
        file: file,
      };
    });
    setFiles((prevFiles) => [...prevFiles, ...uploadFiles.filter((file) => file !== null)]);
  };

  const handleDragStart = (event, fileName) => {
    event.dataTransfer.setData('text/plain', fileName);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDropOnFolder = (event, folderName) => {
    event.preventDefault();
    const fileName = event.dataTransfer.getData('text/plain');
    handleFileMove(fileName, folderName);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop: handleDrop });

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Zip Explorer</h2>
      <div
        {...getRootProps()}
        className={`mb-4 p-8 bg-white border-2 border-dashed rounded-lg text-center cursor-pointer ${
          isDragActive ? 'border-blue-500' : 'border-gray-300'
        }`}
      >
        <input {...getInputProps()} directory="" webkitdirectory="" mozdirectory="" msdirectory="" odirectory="" />
        {isDragActive ? (
          <p className="text-blue-500">Drop files or folders here</p>
        ) : (
          <p>Drag and drop files or folders here, or click to select files</p>
        )}
      </div>
      <ul>
        {files.map((file, index) => (
          <li
            key={index}
            className={`flex items-center py-2 border-b ${
              file.isFolder ? 'bg-blue-50' : 'bg-white'
            }`}
            draggable={!file.isFolder}
            onDragStart={(e) => handleDragStart(e, file.name)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDropOnFolder(e, file.name)}
          >
            <span className={file.isFolder ? 'font-bold' : ''}>{file.name}</span>
            {!file.isFolder && (
              <>
                <button
                  className="ml-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={() => handleFileDelete(file.name)}
                >
                  Delete
                </button>
                <div
                  className="ml-2 px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDropOnFolder(e, '')}
                >
                  Move
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ZipExplorer;
