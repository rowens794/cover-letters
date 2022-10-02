const fs = require("fs");
import gptRequest from "./gptRequest";

export default async function generateGptSections(
  inputPrompt: string,
  headings: string[]
): Promise<string[]> {
  return new Promise(async (resolve, reject) => {
    const template = fs.readFileSync(
      "./lib/gpt-prompts/IMPROVE-SECTIONS.txt",
      "utf8"
    );

    //create an outline string
    let outline = "\n";
    headings.forEach((heading, i) => {
      outline += `${i + 1}. ${heading}\n`;
    });

    const gptPrompt = template
      .replace("<<BRIEF>>", inputPrompt)
      .replace("<<OUTLINE>>", outline);

    const request = "1." + (await gptRequest(gptPrompt));

    const headingArray = parseHeadings(request);

    resolve(headingArray);
  });
}

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
