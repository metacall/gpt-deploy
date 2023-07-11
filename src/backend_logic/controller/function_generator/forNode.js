/*
        convert the following text command as a node.js code with proper indentation without comments without  test cases and without explanation. you should follow each points carefully. 
                    also give the name of the function and dependencies in the below given format
        -------------
                    -the code will be deployed on faas platform
                    -no extra spaces, new lines, or comments or tabs outside the function definition body
                    -do not explain the function
                    -no comments in function body or outside the function definition body
                    -never ever explain function  or code
                    -use camelCase for function name
                    -do not enclose json keys with single  quotes or double quotes
                    -should return a stringified object with function_def, function_name, dependencies as keys
                    -entry function name of python should be same as the function name in json
                    -only external dependencies must be included and dependencies provided by node.js need not be included 
                    -return in such as way that it can be parsed by JSON.parse like add escape \\ characters if needed 
                    -always export the function at the end 
---------------------
I will pass you some functions name and file path, you have to import it and use it whenever necessary don't create one again also don't bother about the file extension is .py, .java. c etc... always import it as it was .js. for e.g 
-------------
{
   "calcFactorial": {"path": "mathutils.py", 
                                     "parameters": [["n": "integer"]],
                                      "returns": "integer"
                                  },
  "safeAdd": {"path": "safeAdd.js", 
                                     "parameters": [["a": "integer"], ["b", "integer"]],
                                    "returns": "integer"
                                  }
}
suppose I ask you to safely add factorial of an array

result should be (note it only function_def, format is shown below)
----------------
const {safeAdd} = require("./safemath.js")
const {calcFactorial} = require("../py/mathutils.py")
function sumOfFactorial(a,b){
   return safeAdd(calcFactoriall(a), calcFactorial(b))
}
module.exports.sumOfFactorial = sumOfFactorial
        ------------------
                    example input:- fuzzy search with fuse.js
        
                    example output:-
        ----------------------
        {"function_def":"const Fuse = require('fuse.js');\\n\\nconst performSearch = () => {\\n\\tconst books = [\\n\\t{ title: \\"The Great Gatsby\\", author: \\"F. Scott Fitzgerald\\" },\\n\\t{ title: \\"To Kill a Mockingbird\\", author: \\"Harper Lee\\" },\\n\\t];\\n\\tconst options = {\\n\\tkeys: ['title', 'author'] };\\n\\tconst fuse = new Fuse(books, options);\\n\\tconst query = 'Great Gatsby';\\n\\tconst results = fuse.search(query);\\n\\tconsole.log(results); \\n} \\nmodule.exports.performSearch = performSearch; ","name": "performSearch" ,  "dependencies":{"fuse.js":  "^6.6.2"}}
        ------------------------
       Uncommented stringified code for:- 

create a server using express with 2 get request isTaskCompleted, createTask

{
   "checkIfTaskCompleted": { "path" : "tasks.py", "parameters": [["taskName","string"]]", "returns": "boolean"},
  "createTask": { "path" : "tasks.py", "parameters": []", "string"}
}
*/

import { Configuration, OpenAIApi } from "openai";
import logger from "../../logger/index.js";
export const getAsker = (apiKey, model) => {
    const configuration = new Configuration({
        apiKey
    });
    const openai = new OpenAIApi(configuration);
    return async (query, metadata) => {
        console.log("metadata-node", metadata)
        const prompt = `
        convert the following text command as a node.js code with proper indentation without comments without  test cases and without explanation. you should follow each points carefully. 
        also give the name of the function, parameter, dependencies and return type in the below given format
    -------------
        -the code will be deployed on faas platform
        -use camelCase for function name
        -do not explain the function
        -do not explain or comments in function body or outside the function definition body or JSON object
        -entry function name of code should be same as the function name in json
        -only external dependencies must be included and dependencies provided in built by node.js need not be included 
        -always export the entry function at the end 
        -names of required function and generated functions should never be same. if you want use const {a:b}= require("c") for required function name if a was the name of generated function
        -should only create code for prompt asked inside >>>>>>>>> and <<<<<<<<<
        -do not change file extension of import to .js , leave it same as provided in path key of functions metadata 
        -should return a stringified object with function_def, function_name, dependencies as keys such that it can be parsed using JSON.parse like use escape \\
    ----------------------
    how to require 
    if extension is .js
        const {funcName} = require("./fn.js")
    else 
        const {funcName} = require("../py/fn.py")
        const {funcName} = require("../c/fn.c")
    ---------------------
    I will pass you some functions name and file path, you have to import it and use it whenever necessary don't create one again also don't bother about the file extension is .py, .java. c etc... always import it as it was .js. for e.g 
    ========================
    \`\`\`
    give sum of factorial of 2 numbers
    
    function metadata:- 
    {
    "calcFactorial": {"path": "mathutils.py", 
                         "parameters": [["n": "integer"]],
                          "returns": "integer"
                      },
    "safeAdd": {"path": "safeAdd.js", 
                         "parameters": [["a": "integer"], ["b", "integer"]],
                        "returns": "integer"
                      }
    }
    \`\`\`
    example output:-
    ----------------
    {"function_def":"const {calcFactorial} = require(\\"../py/mathutils.py\\")\\nconst {safeAdd} = require(\\"./safemath.js\\")\\n\\nfunction sumOfFactorial(a,b){\\n\\treturn safeAdd(calcFactoriall(a), calcFactorial(b))\\n}\\nmodule.exports.sumOfFactorial = sumOfFactorial","name": "sumOfFactorial" ,  "dependencies":{}, "parameters": [["a", "integer"], ["b", "integer"]], "returns": "integer"}
    ==========================
        example input:- 
    ==========================
    \`\`\`
    fuzzy search with fuse.js
    
    function metadata:-
    {
    }
    \`\`\`
    example output:-
    ----------------------
    {"function_def":"const Fuse = require('fuse.js');\\n\\nconst performSearch = () => {\\n\\tconst books = [\\n\\t{ title: \\"The Great Gatsby\\", author: \\"F. Scott Fitzgerald\\" },\\n\\t{ title: \\"To Kill a Mockingbird\\", author: \\"Harper Lee\\" },\\n\\t];const options = {keys: ['title', 'author'] };\\n\\tconst fuse = new Fuse(books, options);\\n\\tconst query = 'Great Gatsby';\\n\\tconst results = fuse.search(query);\\n\\tconsole.log(results); \\n } \\n module.exports.performSearch = performSearch;","name": "performSearch" ,  "dependencies":{"fuse.js":  ""}, "parameters": [], "returns": ""}
    ==========================  
    give Uncommented stringified code for:-
    >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    ${query}
    
    function metadata:-
    
    ${JSON.stringify(metadata)}
    <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        `;
        try {
            const completions = await openai.createCompletion({
                model,
                prompt,
                max_tokens: 2048,
                n: 1,
                stop: null,
                temperature: 1,
            });
            const message = completions.data.choices[0].text;
            try{
                const funcData = JSON.parse(message);
                funcData.language_id = "node";
                return funcData;
            } catch(err){
                throw new Error("Bad Response, Please Regenerate");
            }
        }
        catch (err) {
            const error = err;
            logger.error(error.message);
            throw error;
        }
    };
}

export default getAsker;