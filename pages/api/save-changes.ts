import { NextApiRequest, NextApiResponse } from "next";
const fs = require("fs");

export interface OrgResponse {}

export default async function handler(req, res) {
  const { content, title } = req.body;

  //overwrite the content of the markdown file
  let status = await saveFile(title, content);

  res.statusCode = status === "success" ? 200 : 500;
  res.setHeader("Content-Type", "application/json");
  res.json({ status: status });
}

const saveFile = (title, content) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(`./posts/${title}.md`, content, function (err) {
      if (err) {
        reject("failed");
      } else {
        resolve("success");
      }
    });
  });
};
