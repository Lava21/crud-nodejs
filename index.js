const express = require('express');
const bp = require('body-parser');
const sqlite = require('sqlite3');

const db = new sqlite.Database(__dirname + './db.sqlite', (error) => {
    if (error) throw error;
    console.log('db connected...');
});

db.serialize(() => {
    const sql = `
        CREATE TABLE IF NOT EXISTS contact (
            id integer primary key autoincrement,
            nama varchar(50) not null,
            no_hp varchar(15) not null
        )
    `;
    db.run(sql, (error) => {
        if (error) throw error;
    });
});

const app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(bp.urlencoded({
    extended: false
}));

app.get('/', (req, res) => {
    // view list
    db.serialize(() => {
        const sql = 'SELECT * FROM contact';
        db.all(sql, (error, rows) => {
            if (error) throw error;
            res.render('index.ejs', {
                contact: rows
            });
        });
    });    
});

app.get('/:id', (req, res) => {
    // view detail
    const { id } = req.params;

    db.serialize(() => {
        const sql = `SELECT * FROM contact WHERE id = ${id}`;
        db.get(sql, (error, rows) => {
            if (error) throw error;
            res.render('detail.ejs', {
                contact: rows
            });
        });
    });  
});

app.post('/', (req, res) => {
    // add data
    const {
        nama, 
        no_hp
    } = req.body;
    db.serialize(() => {
        const sql = `INSERT INTO contact (nama, no_hp) VALUES ('${nama}', '${no_hp}')` ;
        db.run(sql, (error, rows) => {
            if (error) throw error;
            res.redirect('/');
        });
    });  
})

app.get('/:id/edit', (req, res) => {
    // edit data
    const { id } = req.params;
    
    db.serialize(() => {
        const sql = `SELECT * FROM contact WHERE id = ${id}`;
        db.get(sql, (error, rows) => {
            if (error) throw error;
            res.render('edit.ejs', {
                contact: rows
            });
        });
    }); 
})

app.post('/:id/update', (req, res) => {
    // update data
    const { id } = req.params;
    const { nama, no_hp } = req.body;
    
    db.serialize(() => {
        const sql = `UPDATE contact SET nama = '${nama}', no_hp = '${no_hp}' WHERE id = ${id}`;
        db.run(sql, (error) => {
            if (error) throw error;
            res.redirect('/');
        });
    }); 
})

app.get('/:id/delete', (req, res) => {
    // delete data
    const { id } = req.params;

    db.serialize(() => {
        const sql = `DELETE FROM contact WHERE id = ${id}`;
        db.run(sql, (error) => {
            if (error) throw error;
            res.redirect('/');
        });
    });  
})

app.listen(8080, () => {
        console.log('Aplikasi sedang berjalan...');        
    }
);

