const express = require('express')
const app = express()
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    // res.send('Hello World! Eiei');
    res.render('index', {
        title: "My First Title"
    });
});

app.listen(3000);
console.log('Example app listening on port 3000!');