import languageIdToExtensionMapping from "../../../../constants/languageIdToExtensionMapping"
export function generateNodePackageJSON(collection){
    const dependencies = {}
    for(let [funcData] of collection){
        Object.assign(dependencies, funcData.dependencies)
    }
    const packageJs = JSON.stringify({
        dependencies
    }, null, 2)
    const packageJsFile = new File([packageJs], "package.json",{type: "text/plain"})
    return packageJsFile;

  }

  export default async function getNodeBundle(collection, zip){
    if(collection.length === 0){
      return ;
    }

    for(let [{name, language_id, function_def}] of collection){
      const file = new File([function_def], `${name}.${languageIdToExtensionMapping[language_id]}`,{type: "text/plain"});
      zip.file(file.name, file);
    }
  }