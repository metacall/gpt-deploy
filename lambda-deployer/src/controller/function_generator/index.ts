import { Request, Response } from "express";
import { Configuration, OpenAIApi } from "openai";
import logger from "../../logger/index.js";
(await import("dotenv")).config();
import parseFunction,{ ParsedFunctionInterface, funcType } from "../../utils/parseFunctions.js";
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
const openai = new OpenAIApi(configuration);
export const ask = async (req: Request, res: Response) => {
    const idn: Number = Math.floor(Math.random()*1000);
    if(Math.random()<0.35) 
        return res.status(400).json({
            message:"unable to create function: testing phase"
        });
    const resp : ParsedFunctionInterface = {
        function_def: `hello${idn} = (data)=>{
                return "currenty you won't get right answer as open ai api key's free trial is finished is not working"
        }`,
        name: 'hello'+idn,
        parameter_names: [["data","string"]]
    }
    return setTimeout(()=>{return res.json(resp);},2000);
    const prompt = `
        convert the following text command as a javascript language's arrow function with proper indentation without comments without  test cases and without explanation
        also give the name of the function and the parameter names in the following format

        -whenever necessary parse the parameter to convert into required datatype as I'll pass the parameter as string
        -answer same as previous if similar question is asked 
        -always give arrow function
        -no extra spaces, new lines, or comments or tabs outside the function definition body
        -no comments in function body
        -do not explain the function
        -no comments in function body or outside the function definition body
        -the function should return result in string format (i.e. asked query like print 1-100 then function should return 1-100 as string)
        -only and only 1 function 
        -please don't explain function as it will be rendered by javascript engine
        -function naming convention :- word separated by underscore
        -separate function definition and metadata with $$$$$ i.e. exactly 5 dollar signs
        -after $$$$$ it should be parsable by json.loads and should return a dictionary with keys function_name, parameter
        -parameter type should be string, int, float, boolean, list, object

        example input:- add two numbers

        example output:-

        two_number_sum = (a,b,prefix)=>{\n\tconst ans=a+b;\n\t  return ans;\n }$$$$$\${"function_name": "two_number_sum" ,  "parameter": [["a","int"],["b","int"], ["c","string"]]}
        
        function declaration on following :-
        
        ${req.body.prompt}
    `;
    try {
        const completions = await openai.createCompletion({
        model: "text-davinci-003",
        prompt,
        max_tokens: 2048,
        n: 1,
        stop: null,
        temperature: 1,
        });
        const message = completions.data.choices[0].text as funcType;
        const response: ParsedFunctionInterface = parseFunction(message);
        res.json(response)
    } catch (err: unknown) {
        const error = err as Error;
        logger.error(error.message);
        res.status(400).json({
            message:"unable to create function"
        });
    }
}
