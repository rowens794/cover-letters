const fs = require("fs");
import gptRequest from "./gptRequest";

export default async function generateGptSections(
  inputPrompt: string
): Promise<string[]> {
  return new Promise(async (resolve, reject) => {
    const template = fs.readFileSync(
      "./lib/gpt-prompts/GEN-SECTIONS.txt",
      "utf8"
    );
    const gptPrompt = template.replace("<<BRIEF>>", inputPrompt);

    const sections = await gptRequest(gptPrompt);
    const lastSection = getLastNumber(sections);

    //run the sections functions 2 extra times to build out the section list
    const revisedPrompt = gptPrompt + sections + "\n" + lastSection + ".";

    //second run
    const sections2 = await gptRequest(revisedPrompt);
    const revisedPrompt2 = revisedPrompt + sections2;

    //third run
    let sections3 = await gptRequest(revisedPrompt2);
    const revisedPrompt3 = revisedPrompt + sections3;

    //parse individual section elements
    let headings = parseHeadings(revisedPrompt3);

    resolve(headings);
  });
}

const getLastNumber = (str) => {
  let listArray = str.split("\n");
  let lastElement = listArray[listArray.length - 1];
  let lastNumber = lastElement.match(/\d+/g).map(Number)[0] + 1;
  return lastNumber.toString();
};

const parseHeadings = (str) => {
  //get string starting from "SECTIONS:"
  let substring = str.substring(str.indexOf("SECTIONS:"));

  //split string into array
  let listArray = substring.split("\n").slice(1);

  let cleanedList = [];
  listArray.forEach((item) => {
    let numberLen = item.indexOf(".");
    if (numberLen === 1 && item.length > 2) {
      cleanedList.push(item.slice(3));
    } else if (numberLen === 1 && item.length > 2) {
      cleanedList.push(item.slice(4));
    }
  });

  return cleanedList;
};
