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
                sql = `SELECT * FROM Історія_лотів WHERE ID_аукціону = ${filter}`;
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

app.get('/data', (req, res) => {
    var filter = req.query.filter;
    var sql = '';
    if(filter) {
        switch(filter) {
            case "aucs":
                var sql = "SELECT * FROM Аукціон";
                break;
            case "users_sum_stats":
                var sql = "SELECT * FROM Покупці ORDER BY Сума_транзакцій DESC"
                break;
            case "sums_list":
                sql = "SELECT * FROM Історія_лотів ORDER BY Ціна + Ціна_зміна DESC"
                break;
            case "changed_sums_list":
                sql = "SELECT * FROM Історія_лотів ORDER BY Ціна_зміна DESC"
                break;
            case "valued_buy_list":
                sql = "SELECT * FROM Історія_лотів WHERE Статус IS NOT \"Списано\" ORDER BY Продано_за DESC"
                break;
            case "aucs_history":
                sql = `SELECT 
                        a.ID AS ID_аукціону,
                        a.Назва AS Назва,
                        a.Дата AS Дата,
                        a.Час AS Час,
                        a.Місце_проведення AS Місце_проведення,
                        a.Дата_закриття AS Дата_закриття,
                        JSON_GROUP_ARRAY(
                            JSON_OBJECT(
                                'ID_лоту', l.ID,
                                'Опис', l.Опис,
                                'Продавець', l.Продавець,
                                'Ціна', l.Ціна,
                                'Ціна_зміна', l.Ціна_зміна,
                                'Картинка', l.Картинка,
                                'Продано_за', l.Продано_за,
                                'Покупець', l.Покупець,
                                'Статус', l.Статус
                            )
                        ) AS Лоти
                    FROM
                        Історія_аукціонів a
                    LEFT JOIN
                        Історія_лотів l ON a.ID = l.ID_аукціону
                    GROUP BY
                        a.ID, a.Назва, a.Дата, a.Час, a.Місце_проведення, a.Дата_закриття;
                    `
                break;
            case "unsolded_lots":
                sql =  "SELECT * FROM Історія_лотів WHERE Статус IS \"Списано\""
                break;
            case "auc_and_buyer":
                sql = `SELECT
                    a.ID AS ID_аукціону,
                    a.Назва AS Назва_аукціону,
                        JSON_GROUP_ARRAY(
                            JSON_OBJECT(
                                'ID-покупця', p.ID,
                                'Імя', p.Імя_користувача
                            )
                        ) AS Покупці
                    FROM
                        Історія_аукціонів a
                    LEFT JOIN
                        Історія_лотів l ON a.ID = l.ID_аукціону
                    LEFT JOIN
                        Покупці p ON l.Покупець = p.ID
                    WHERE
                        a.Дата_закриття IS NOT NULL
                    GROUP BY
                        a.ID, a.Назва, a.Дата, a.Час, a.Місце_проведення, a.Дата_закриття;
                    `
                break;
            default:
                var sql = `SELECT * FROM Історія_лотів WHERE ID = ${filter}`
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
})


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
