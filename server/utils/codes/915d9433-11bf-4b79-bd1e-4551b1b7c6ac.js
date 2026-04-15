const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split('\n');
const a = Number(input[0]);
const b = Number(input[1]);
console.log(a + b);