const fs = require("fs");
import gptRequest from "./gptRequest";

export default async function generateGptSections(
  sections: string[]
): Promise<string> {
  return new Promise(async (resolve, reject) => {
    const sectionNotesTemplate = fs.readFileSync(
      "./lib/gpt-prompts/GEN-RESEARCH-NOTES.txt",
      "utf8"
    );

    let articleContent = [];

    for (let i = 0; i < sections.length; i++) {
      console.log(
        `------ 3.1 Compiling Notes (${i + 1} of ${sections.length}) ---`
      );
      let sectionNotes = [];
      let sectionHeading = sections[i];
      articleContent.push(`## ${sectionHeading}`);

      const sectionNotesPrompt = sectionNotesTemplate.replaceAll(
        "<<SECTION_TITLE>>",
        sectionHeading
      );

      while (sectionNotes.length < 15) {
        const sectionContent = await gptRequest(sectionNotesPrompt);
        sectionNotes = [...sectionNotes, ...parseSectionNotes(sectionContent)];
      }

      console.log(
        `------ 3.2 Writing Blog Content (${i + 1} of ${sections.length}) ---`
      );
      //convert notes into a written narrative
      const sectionContentTemplate = fs.readFileSync(
        "./lib/gpt-prompts/GEN-SECTION-CONTENT.txt",
        "utf8"
      );

      const sectionContentPrompt = sectionContentTemplate.replaceAll(
        "<<RESEARCH_NOTES>>",
        "- " + sectionNotes.join("\n- ")
      );

      const sectionContent = await gptRequest(sectionContentPrompt);
      articleContent.push("\n", sectionContent, "\n\n");
    }

    resolve(articleContent.join(""));
  });
}

const parseSectionNotes = (str): string[] => {
  //get string starting from "SECTIONS:"
  let substring = str.substring(str.indexOf("detail research notes:"));
  const substringArray = substring.split("\n");
  const cleanedArray = [];

  //eliminate non-alphabetical characters from the first few characters of each element
  substringArray.forEach((item, i) => {
    let isNonAlpha = true;
    let phrase = item;

    while (isNonAlpha && item.length > 0) {
      let firstChar = phrase.charAt(0);
      if (alphabet.includes(firstChar)) {
        isNonAlpha = false;
      } else {
        phrase = phrase.substring(1);
      }
    }

    cleanedArray.push(phrase.trim());
  });

  //eliminate empty elements
  const finalArray = cleanedArray.filter((item) => item.length > 25);

  return finalArray;
};

let alphabet = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];
