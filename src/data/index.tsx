import path from "path";
import fs from "fs";

export async function getSymbolData() {
  const filePath = path.join(process.cwd(), "src", "data", "symbol.json");
  const jsonData = await fs.promises.readFile(filePath, "utf-8");
  const data = JSON.parse(jsonData);
  return data || [];
}
