import * as fs from "node:fs";
import * as path from "node:path";

function walkDir(dir: string): string[] {
  let results: string[] = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory() && !file.includes('node_modules') && !file.includes('dist') && !file.includes('.git')) { 
      results = results.concat(walkDir(file));
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = walkDir('./packages');
let changedFiles = 0;
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('Deno.env.get')) {
    const newContent = content.replace(/Deno\.env\.get\((['"`])(.*?)\1\)/g, "(typeof Deno !== 'undefined' ? Deno.env.get($1$2$1) : process?.env?.[$1$2$1])");
    if (newContent !== content) {
      fs.writeFileSync(file, newContent);
      changedFiles++;
      console.log(`Updated ${file}`);
    }
  }
}
console.log('Changed API files:', changedFiles);
