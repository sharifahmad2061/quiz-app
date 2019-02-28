var fs = require('fs');
var obj = JSON.parse(fs.readFileSync('question/Math.json', 'utf8'));
var sql = "INSERT INTO math VALUES";
var index = 0;
for (const key in obj) {
    if (key == "urdu") continue;
    if (obj.hasOwnProperty(key)) {
        const values = obj[key];
        sql += `("${key}","${values[0]}","${values[1]}","${values[2]}","${values[3]}",${values[4]},"${obj['urdu'][index]}"),`;
        index++;
        // sql += `("${key}",${values[4]}),`
    }
}
sql = sql.slice(0, -1);
sql += ";"
fs.writeFileSync("math.sql", sql);