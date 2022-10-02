import { NextApiRequest, NextApiResponse } from "next";
const fs = require("fs");

import generateGptSections from "../../lib/controllers/generateGptSections";
import improveGptSections from "../../lib/controllers/improveGptSections";
import writeTitle from "../../lib/controllers/writeTitle";
import writeSections from "../../lib/controllers/writeSections";
import saveToMd from "../../lib/controllers/writeDocToMdFile";
import titleToSlug from "../../lib/controllers/titleToSlug";

export interface OrgResponse {}

export default async function handler(req, res) {
  const brief = req.body.prompt;
  console.log("Brief: ", brief);

  console.log("--- 1. Blog Sections ---");
  const gptSections = await generateGptSections(brief);

  console.log("--- 2. Improved Sections ---");
  const improvedGptSections = await improveGptSections(brief, gptSections);

  console.log("--- 3. Generate Post Title ---");
  const postTitle = "TITLE: " + (await writeTitle(brief));

  console.log("--- 4. Writing Post ---");
  const markdownText =
    postTitle + "\n\n" + (await writeSections(improvedGptSections));

  console.log("--- 5. Saving Post ---");
  saveToMd(markdownText, titleToSlug(postTitle.replace("TITLE: ", "")));

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.json({ content: markdownText });
}
