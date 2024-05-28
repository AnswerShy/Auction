const sqlite3 = require('sqlite3');
const path = require('path');
const express = require('express');

const app = express();
const dbPath = path.join(__dirname, 'database/databaseMain.db');

let db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Error connecting to the database:", err.message);
    } else {
        console.log('Connected to databaseMain.db', dbPath);
    }
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

app.get('/lots', (req, res) => {
    var sql = "SELECT * FROM Лот";
    var filter = req.query.filter;
    if (filter) {
        switch (filter) {
            case "cost_up":
                sql += " ORDER BY Ціна ASC";
                break;
            case "cost_down":
                sql += " ORDER BY Ціна DESC";
                break;
            default:
                sql += ` WHERE ID_аукціону = ${filter}`;
                break;
        }
    }
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({"error": err.message});
            return;
        }
        res.json({
            "message": "success",
            "data": rows 
        });
    });
});

app.get('/aucs', (req, res) => {
    var sql = "SELECT * FROM Аукціон";
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({"error": err.message});
            return;
        }
        res.json({
            "message": "success",
            "data": rows 
        });
    });
})

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
