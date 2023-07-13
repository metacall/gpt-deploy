function getFunctions(code){
    const functionRegex = /(?:function\s+([\w$]+)\s*\(([^)]*)\)|const\s+([\w$]+)\s*=\s*function\s*\(([^)]*)\))|([\w$]+)\s*=\s*\(([^)]*)\)\s*=>/g;
    
    const matches = code.matchAll(functionRegex);
    const functionData = {};
    
    for (const match of matches) {
      const functionName = match[1] || match[3] || match[5];
      const parameters = match[2] || match[4] || match[6] || '';
    
      const paramList = parameters.split(',').map(param => {
        const [name, type] = param.trim().split(':');
        return [name.trim(), type ? type.trim() : 'any'];
      });
    
      functionData[functionName] = paramList;
    }
    
    return functionData;
    }
    
function getExportedVariables(code){
    
    const regex1 = /(?:module\.exports\.(\w+)|export\s+(?:default\s+)?(\w+))/g;
    
    const matches = [];
    
    let match;
    while ((match = regex1.exec(code)) !== null) {
    if (match[1]) {
        matches.push(match[1]);
    } else if (match[2]) {
        matches.push(match[2]);
    }
    }
    
    
    return matches;
}
        
function findIntersection(funcs, names){
    for(let i =  names.length - 1; i>=0;i--){
    if(funcs.hasOwnProperty(names[i]))
        return [names[i], funcs[names[i]]];
    }
    return null;
}
    
function getDependencies(code){
    const packageRegex = /(?<!\.\.\/)(?<!\.\/)(?:import\s+[\w$]+\s+from\s+['"]\s*(@[\w$]+\/[\w$]+)\s*['"]|import\s+['"]\s*(@[\w$]+)\s*['"]|import\s+\{(?:[^}]+)\}\s+from\s+['"]\s*([\w$]+)\s*['"]|import\s+(?:(?:[\w$]+\s*,?\s*)+from\s+)?['"]\s*(@[\w$]+)\s*['"]|const\s+[\w$]+\s*=\s*require\(\s*['"]\s*([\w$]+)\s*['"]\s*\))/g;
    
    let match;
    const packages = new Set();
    while ((match = packageRegex.exec(code)) !== null) {
        const packageName = match[1] || match[2] || match[3] || match[4] || match[5];
        packages.add(packageName);
    }
    
    return Array.from(packages);
    }
      
export default function getMetadata(code){
      
    const functions = getFunctions(code);
    const exportedVariables = getExportedVariables(code);
    let exportedFunction = findIntersection(functions, exportedVariables);
    let packages = getDependencies(code);
    let dependencies = {};
    for(let dep of packages)
        dependencies[dep] = 'latest';
    
    const metadata = {
        function_def: code,
        name: exportedFunction?.[0] ?? null,
        parameters: exportedFunction[1],
        returns: "any",
        dependencies
    }
    
    return metadata;
}

    
    