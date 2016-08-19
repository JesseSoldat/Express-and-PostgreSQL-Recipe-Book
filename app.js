var express = require('express'),
	path = require('path'),
	bodyParser = require('body-parser'),
	cons = require('consolidate'),
	dust = require('dustjs-helpers'),
	pg = require('pg');

var app = express();

var connect = 'postgres://education:ichiban123@localhost/recipebookdb';

app.engine('dust', cons.dust);
app.set('view engine', 'dust');
app.set('views', __dirname + '/views');


app.use(express.static(path.join(__dirname + '/public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.get('/', function(req, res){
	pg.connect(connect, function(err, client, done){
		if(err) {
			return console.error('error fetching client from pool', err);
		}
		client.query('SELECT * FROM recipes', function(err, result){
			if(err){
				return console.error('error running query', err);
			}
			res.render('index', {recipes: result.rows})
			done();

		});
	});
});

app.post('/add', function(req, res){
	pg.connect(connect, function(err, client, done){
		if(err) {
			return console.error('error fetching client from pool', err);
		}
		client.query('INSERT INTO recipes(name, ingredients, directions) VALUES($1, $2, $3)', [req.body.name, req.body.ingredients, req.body.directions]);
		done();
		res.redirect('/');
	});
});

app.delete('/delete/:id', function(req, res){
	pg.connect(connect, function(err, client, done){
		if(err) {
			return console.error('error fetching client from pool', err);
		}
		client.query('DELETE FROM recipes WHERE id = $1', [req.params.id]);
		done();
		res.sendStatus(200);
	});
});

app.listen(3000, function(){
	console.log('listening on 3000');
});