var app = require('express')();
var cors = require('cors');
var axios = require('axios');
var cheerio = require('cheerio');

app.use(cors('*'));

app.get('/api/the100/game/:game', function(req, res) {
    axios.get(`https://www.the100.io/game/${req.params.game}`)
    .then(function(response) {
        var $ = cheerio.load(response.data)
        var gamertags = $('.gamertag a').map(function() { return $(this).text(); }).get();
        res.json(gamertags);
    })
    .catch(function() {
        res.json([])
    })
});

app.listen(3000);
