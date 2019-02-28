var fs = require('fs');
var obj = JSON.parse(fs.readFileSync('question/it2.json', 'utf8'));
var sql = "INSERT INTO it2 VALUES";
var index = 0;
for (const key in obj) {
    // if (key == "urdu") continue;
    if (index++ < 62) {
        if (obj.hasOwnProperty(key)) {
            const values = obj[key];
            // sql += `("${key}","${values[0]}","${values[1]}","${values[2]}","${values[3]}",${values[4]},"${obj['urdu'][index]}"),`;
            // index++;
            sql += `(0,"${key}","","","","","",${values[4]}),`
        }
    } else {
        const values = obj[key];
        sql += `(1,"","${key}","${values[0]}","${values[1]}","${values[2]}","${values[3]}",${values[4]}),`
    }
}
sql = sql.slice(0, -1);
sql += ";"
fs.writeFileSync("it2.sql", sql);