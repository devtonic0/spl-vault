const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'dist', 'index.js');

let content = fs.readFileSync(indexPath, 'utf8');
content = content.replace(/require\("(.+?)"\)/g, 'require("$1.js")');
fs.writeFileSync(indexPath, content);

