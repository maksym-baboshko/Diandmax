import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SRC_ROOT = path.join(ROOT, "src");
const TARGET_EXTS = new Set([".ts", ".tsx"]);

const REPLACEMENTS = [
  { from: "rounded-[1.5rem]", to: "rounded-3xl" },
  { from: "rounded-[2rem]", to: "rounded-4xl" },
  { from: "top-[-8px]", to: "-top-2" },
  { from: "border-x-[18px]", to: "border-x-18" },
  { from: "border-b-[28px]", to: "border-b-28" },
  { from: "min-w-[200px]", to: "min-w-50" },
  { from: "min-w-[220px]", to: "min-w-55" },
  { from: "min-w-[240px]", to: "min-w-60" },
  { from: "max-w-[21rem]", to: "max-w-84" },
];

function walkDir(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(fullPath, files);
      continue;
    }
    if (TARGET_EXTS.has(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }
  return files;
}

function getLineNumber(text, index) {
  let line = 1;
  let lastIndex = 0;
  while (true) {
    const nextIndex = text.indexOf("\n", lastIndex);
    if (nextIndex === -1 || nextIndex >= index) {
      break;
    }
    line += 1;
    lastIndex = nextIndex + 1;
  }
  return line;
}

function findMatches(filePath, content) {
  const matches = [];
  for (const { from, to } of REPLACEMENTS) {
    let searchIndex = 0;
    while (true) {
      const foundIndex = content.indexOf(from, searchIndex);
      if (foundIndex === -1) {
        break;
      }
      const line = getLineNumber(content, foundIndex);
      matches.push({
        filePath,
        line,
        from,
        to,
      });
      searchIndex = foundIndex + from.length;
    }
  }
  return matches;
}

function main() {
  if (!fs.existsSync(SRC_ROOT)) {
    console.log("src/ directory not found. Skipping canonical-class lint.");
    return;
  }

  const files = walkDir(SRC_ROOT);
  const issues = [];

  for (const file of files) {
    const content = fs.readFileSync(file, "utf8");
    issues.push(...findMatches(file, content));
  }

  if (issues.length === 0) {
    return;
  }

  for (const issue of issues) {
    const relativePath = path.relative(ROOT, issue.filePath);
    console.error(`${relativePath}:${issue.line} ${issue.from} -> ${issue.to}`);
  }

  process.exit(1);
}

main();
