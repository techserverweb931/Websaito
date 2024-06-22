// app.js
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// MySQL接続の設定
const db = mysql.createConnection({
    host: '192.168.3.10',
    user: 'minecraft',
    password: '0000',
    database: 'techcraft'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySQLに接続しました');
});

// 中間処理の設定
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 静的ファイルの提供（index.htmlやpre-registration.htmlを含む）
app.use(express.static(path.join(__dirname, 'public')));

// 事前登録を処理するエンドポイント
app.post('/register', (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).send('名前とメールアドレスが必要です');
    }

    const registration = { name, email };

    const query = 'INSERT INTO registrations SET ?';
    db.query(query, registration, (err, result) => {
        if (err) {
            console.error('登録情報の保存に失敗しました: ', err);
            return res.status(500).send('登録情報の保存に失敗しました');
        }
        res.status(200).send('登録が成功しました');
    });
});

// サーバーを起動
app.listen(PORT, () => {
    console.log(`サーバーがポート${PORT}で起動しました`);
});
