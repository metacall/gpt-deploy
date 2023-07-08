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