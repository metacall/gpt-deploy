import JSZip from "jszip";
import {generateNodePackageJSON} from "./packageGenerator/generateNodePackageJSON"
import {generatePythonRequirementsTXT} from "./packageGenerator/generatePythonRequirementsTXT"
import languageIdToExtensionMapping from "../../../constants/languageIdToExtensionMapping"
import metacallerFileAsString from "./packageGenerator/metacallerFileAsString";
function generatePackages(collection, extraFiles){

    const language_ids = [...new Set(collection.map(([{language_id}])=>language_id))]
    const separatedCollections = language_ids.map(lang_id => [lang_id, collection.filter(([{language_id}])=>language_id === lang_id)])
    const packageFiles = []
    for(let [lang_id, colls] of separatedCollections){
        switch(lang_id){
            case 'node':
                packageFiles.push(generateNodePackageJSON(colls, extraFiles[lang_id]))
                break;
            case 'python':
                packageFiles.push(generatePythonRequirementsTXT(colls, extraFiles[lang_id]))
                break;
            default:
                break;
        }
    }
    return packageFiles;
  }

function addFolderToZip(collection, zip){
  if(collection.length === 0){
    return false;
  }

  let isMetacallerFileRequired = false;
  for(let [{name, language_id, function_def, createFunctionRequired = false}] of collection){
    const file = new File([function_def], `${name}.${languageIdToExtensionMapping[language_id]}`,{type: "text/plain"});
    zip.file(file.name, file);
    isMetacallerFileRequired = isMetacallerFileRequired || createFunctionRequired;
  }
  

  if(isMetacallerFileRequired){
    const metacallerFile = new File([metacallerFileAsString], `metacaller.py`,{type: "text/plain"});
    zip.file(metacallerFile.name, metacallerFile);
  }

  return isMetacallerFileRequired
}

export default  async function Bundle(collection, metacallJSON){
    const zip =new JSZip();
  
    const language_ids = [...new Set(collection.map(([{language_id}])=>language_id))]

    const separatedCollections = language_ids.map(lang_id => [lang_id, collection.filter(([{language_id}])=>language_id === lang_id)])
    const folders = Object.fromEntries(language_ids.map(language_id => [language_id, zip.folder(language_id)]))

    const extraFiles = {}
    for(let [lang_id, colls] of separatedCollections){
        const isMetacallerFileRequired =  addFolderToZip(colls, folders[lang_id], lang_id) 
        if(isMetacallerFileRequired){
          extraFiles[lang_id] = ['metacaller.py'];
        }  
    }

    const entryFileName = metacallJSON.name;
    const metacall_json = JSON.stringify({
        language_id : metacallJSON.language_id,
        path: metacallJSON.language_id,
        scripts:[entryFileName]
    })
    const metacall_json_file = new File([metacall_json], "metacall.json",{type: "text/plain"})
    zip.file(metacall_json_file.name, metacall_json_file );
    
    const packageFiles = generatePackages(collection, extraFiles)
    for (let packageFile of packageFiles){
      zip.file(packageFile.name, packageFile);
    }

    return new Promise((resolve)=>{
      zip.generateAsync({
            type:"blob",
            mimeType: 'application/x-zip-compressed'
        }).then((generatedZipBlob)=>{
          const prefix = entryFileName.split('.')[0]
          resolve([generatedZipBlob, prefix, entryFileName])
        })
    })
  }