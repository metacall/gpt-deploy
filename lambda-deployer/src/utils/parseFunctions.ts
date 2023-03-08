type Types = 'int' | 'float' | 'boolean' | 'list' | 'object' | 'string';
type parameter = [string, Types];
export type funcType = `${string}$$$$$$${string}`;
export interface ParsedFunctionInterface {
    function_def: string;
    name: string;
    parameter_names: parameter[];
}

export default function parseFunction(func: funcType): ParsedFunctionInterface {
  const [functionDef, metadataStr] = func.split('$$$$$$');
  const metadata = JSON.parse(metadataStr);
  return {
    function_def: functionDef.trim(),
    name: metadata.function_name,
    parameter_names: metadata.parameter,
  };
}

