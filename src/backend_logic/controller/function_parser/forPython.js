function getFunctionParameters(pythonCode, functionName) {
  const functionRegex = new RegExp(
    `def\\s+${functionName}\\s*\\(([^)]*)\\)`,
    "g"
  );
  const parameterRegex = /(\w+)\s*(?::\s*([\w.]+))?/g;
  let parameters = [];

  let match;
  while ((match = functionRegex.exec(pythonCode)) !== null) {
    const parameterDetails = Array.from(match[1].matchAll(parameterRegex)).map(
      (paramMatch) => {
        const paramName = paramMatch[1];
        const paramType = paramMatch[2] || "any";
        return [paramName, paramType];
      }
    );

    parameters = parameterDetails;
  }

  return parameters;
}

function getLastFunctionName(pythonCode) {
  const functionRegex = /def\s+\s*(\w+)\s*\(/g;
  let lastFunctionName = "";

  let match;
  while ((match = functionRegex.exec(pythonCode)) !== null) {
    lastFunctionName = match[1];
  }

  const parameters = getFunctionParameters(pythonCode, lastFunctionName);
  return [lastFunctionName, parameters];
}

function getDependencies(pythonCode) {
  const importRegex = /(?:from\s+([\w.]+)\s+import|import\s+([\w.]+))/g;
  const packageNames = new Set();
  let match;

  while ((match = importRegex.exec(pythonCode)) !== null) {
    const importedPackage = match[1] || match[2];
    const packageName = importedPackage.split(".")[0];
    packageNames.add(packageName);
  }

  return Array.from(packageNames);
}

export default function getMetadata(code) {
  const lstFunction = getLastFunctionName(code);

  let packages = getDependencies(code);
  let dependencies = {};
  for (let dep of packages) dependencies[dep] = "latest";

  const metadata = {
    function_def: code,
    name: lstFunction[0],
    parameters: lstFunction[1],
    returns: "any",
    dependencies,
  };

  return metadata;
}
