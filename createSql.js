var fs = require('fs');
var obj = JSON.parse(fs.readFileSync('question/it2.json', 'utf8'));
var sql = "INSERT INTO it2 VALUES";
for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
        const values = obj[key];
        // sql += `("${key}","${values[0]}","${values[1]}","${values[2]}","${values[3]}",${values[4]}),`;
        sql += `("${key}",${values[4]}),`
    }
}
sql = sql.slice(0, -1);
sql += ";"
fs.writeFileSync("it2.sql", sql);