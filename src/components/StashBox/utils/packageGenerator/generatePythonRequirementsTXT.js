export function generatePythonRequirementsTXT(collection, extraFiles){
    const dependencies = {}
    if(extraFiles.includes('metacaller.py')){
        dependencies['metacall'] = '0.5.0'
    }
    for(let [funcData] of collection){
        Object.assign(dependencies, funcData.dependencies)
    }
    const requirementsTxt = Object.entries(dependencies).map(([name, version])=>`${name}==${version}`).join('\n')
    const requirementsTxtFile = new File([requirementsTxt], "requirements.txt",{type: "text/plain"})
    return requirementsTxtFile;
}