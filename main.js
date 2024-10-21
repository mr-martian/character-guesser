var DB = null;

function loadData() {
    const statements = `
create table if not exists characters(name TEXT PRIMARY KEY);
create table if not exists guesses(name);
create table if not exists answers(name, question, value, UNIQUE(name, question));
create table if not exists questions(key, text, UNIQUE(key));
create table if not exists game(lastq);
`;
    const questions = {
	'human': "Is this character human?",
	'fingers': "Does this character have fingers?",
	'born_earth': "Was this character born on Earth?",
	'tophat': "Does this character wear a top hat?",
	'poison_tree': "Is this character known for poisoning trees?",
	'telepath': "Is this character telepathic?",
	'marry_alien': "Does this character have a spouse of a different species?",
	'beard': "Does this character have a beard at any point?",
	'TV': "Is this character originally from a TV show?",
	'book': "Is this character originally from a book?",
	'movie': "Is this character originally from a movie? (TV pilot movies don't count.)",
	'breadbox': "Is this character larger than a breadbox?",
	'sword': "Does this character have a special sword?",
	'bathing_suit': "Does this character look funny in a bathing suit?",
	'talk_dragon': "Does this character talk to a dragon?",
	'kill_dragon': "Does this character kill a dragon?",
	'create_dragon': "Does this character create a dragon?",
	'dead': "Has this character died?",
	'glasses': "Does this character wear glasses?",
	'swim': "Can this character swim?",
    };
    const characters = {
	'Sauron': {'human': 0, 'fingers': 1, 'born_earth': 0, 'tophat': 0, 'poison_tree': 0, 'telepath': 1, 'marry_alien': 0, 'TV': 0, 'book': 1, 'movie': 0, 'breadbox': 1, 'sword': 0, 'dead': 0},
	'Mr. Darcy': {'human': 1, 'fingers': 1, 'born_earth': 1, 'tophat': 1, 'poison_tree': 0, 'telepath': 0, 'marry_alien': 0, 'TV': 0, 'book': 1, 'movie': 0, 'breadbox': 1, 'sword': 0, 'bathing_suit': 0, 'swim': 1},
	'John Sheridan': {'human': 1, 'fingers': 1, 'born_earth': 1, 'tophat': 0, 'poison_tree': 0, 'telepath': 0, 'marry_alien': 1, 'TV': 1, 'book': 0, 'movie': 0, 'sword': 0, 'dead': 1},
	'Ungoliant': {'human': 0, 'fingers': 0, 'born_earth': 0, 'tophat': 0, 'poison_tree': 1, 'telepath': 0, 'beard': 0, 'TV': 0, 'book': 1, 'movie': 1, 'breadbox': 1, 'sword': 0, 'dead': 1},
	'Tom Bombadil': {'human': 0, 'fingers': 1, 'born_earth': 0, 'poison_tree': 0, 'telepath': 0, 'marry_alien': 1, 'beard': 1, 'TV': 0, 'book': 1, 'movie': 0, 'breadbox': 1, 'sword': 0, 'dead': 0},
	'Alfred Bester': {'human': 1, 'fingers': 1, 'born_earth': 1, 'tophat': 0, 'poison_tree': 0, 'telepath': 1, 'marry_alien': 0, 'beard': 0, 'TV': 1, 'book': 0, 'movie': 0, 'breadbox': 1, 'sword': 0, 'dead': 1},
	'Martin The Warrior': {'human': 0, 'fingers': 1, 'born_earth': 0, 'tophat': 0, 'poison_tree': 0, 'telepath': 0, 'marry_alien': 0, 'beard': 0, 'TV': 0, 'book': 1, 'movie': 0, 'breadbox': 0, 'sword': 1, 'dead': 1},
	'Aragorn': {'human': 1, 'fingers': 1, 'born_earth': 0, 'tophat': 0, 'poison_tree': 0, 'telepath': 0, 'marry_alien': 1, 'beard': 1, 'TV': 0, 'book': 1, 'movie': 0, 'breadbox': 1, 'sword': 1, 'dead': 1},
	'Delenn': {'human': 0, 'fingers': 1, 'born_earth': 0, 'tophat': 0, 'poison_tree': 0, 'telepath': 0, 'marry_alien': 1, 'beard': 0, 'TV': 1, 'book': 0, 'movie': 0, 'breadbox': 1, 'sword': 0, 'dead': 1},
	'Frog': {'human': 0, 'fingers': 1, 'tophat': 0, 'poison_tree': 0, 'telepath': 0, 'marry_alien': 0, 'beard': 0, 'TV': 0, 'book': 1, 'movie': 0, 'sword': 0, 'bathing_suit': 0, 'dead': 0, 'swim': 1},
	'Toad': {'human': 0, 'fingers': 1, 'tophat': 0, 'poison_tree': 0, 'telepath': 0, 'marry_alien': 0, 'beard': 0, 'TV': 0, 'book': 1, 'movie': 0, 'sword': 0, 'bathing_suit': 1, 'dead': 0, 'swim': 1},
	'Eragon': {'human': 1, 'fingers': 1, 'born_earth': 0, 'tophat': 0, 'poison_tree': 0, 'telepath': 1, 'beard': 0, 'TV': 0, 'book': 1, 'movie': 0, 'sword': 1, 'talk_dragon': 1, 'dead': 0},
	'Morgoth': {'human': 0, 'fingers': 1, 'born_earth': 0, 'tophat': 0, 'poison_tree': 1, 'telepath': 1, 'marry_alien': 0, 'TV': 0, 'book': 1, 'movie': 0, 'breadbox': 1, 'sword': 0, 'create_dragon': 1, 'dead': 0},
	'Hagrid': {'human': 0, 'fingers': 1, 'born_earth': 1, 'tophat': 0, 'poison_tree': 0, 'telepath': 0, 'marry_alien': 0, 'beard': 1, 'TV': 0, 'book': 1, 'movie': 0, 'breadbox': 1, 'sword': 0, 'talk_dragon': 1, 'kill_dragon': 0, 'create_dragon': 0, 'dead': 0, 'glasses': 0},
	'Buzz Lightyear': {'human': 0, 'fingers': 1, 'born_earth': 1, 'tophat': 0, 'poison_tree': 0, 'telepath': 0, 'marry_alien': 0, 'beard': 0, 'TV': 0, 'book': 0, 'movie': 1, 'breadbox': 0, 'sword': 0, 'talk_dragon': 0, 'kill_dragon': 0, 'create_dragon': 0, 'dead': 0, 'glasses': 0},
	'Inigo Montoya': {'human': 1, 'fingers': 1, 'born_earth': 1, 'tophat': 0, 'poison_tree': 0, 'telepath': 0, 'marry_alien': 0, 'beard': 0, 'TV': 0, 'book': 1, 'movie': 0, 'breadbox': 1, 'sword': 1, 'talk_dragon': 0, 'kill_dragon': 0, 'create_dragon': 0, 'dead': 0, 'glasses': 0, 'swim': 0},
    };

    DB.exec(statements);
    for (const pair of Object.entries(questions)) {
	DB.exec(
	    "INSERT INTO questions(key, text) VALUES(?, ?) ON CONFLICT DO NOTHING",
	    {bind: pair},
	);
    }
    for (const [name, answers] of Object.entries(characters)) {
	DB.exec(
	    "INSERT INTO characters(name) VALUES(?) ON CONFLICT DO NOTHING",
	    {bind: [name]},
	)
	for (const [q, a] of Object.entries(answers)) {
	    DB.exec(
		"INSERT INTO answers(name, question, value) VALUES(?, ?, ?) ON CONFLICT DO NOTHING",
		{bind: [name, q, (a == 0 ? 'no' : 'yes')]},
	    );
	}
    }
}

var GAME = {};

function startGame() {
    DB.exec([
	"DELETE FROM guesses;",
	"INSERT INTO guesses SELECT * FROM characters;",
    ]);
    GAME = {
	asked: 0,
	remainingQuestions: DB.selectValues("SELECT key FROM questions;"),
	lastQuestion: null,
	answers: [],
	guess: null,
    };
    document.getElementById('startgamebox').style.display = 'none';
    document.getElementById('questionbox').style.display = 'block';
    askQuestion();
}

function askQuestion() {
    const guessCount = DB.selectValue("SELECT count(*) FROM guesses;");
    if (GAME.asked >= 20 || guessCount <= 1 || GAME.remainingQuestions.length == 0) {
	GAME.guess = DB.selectValue("SELECT name FROM guesses;");
	document.getElementById('guess').innerHTML = GAME.guess;
	document.getElementById('questionbox').style.display = 'none';
	document.getElementById('guessbox').style.display = 'block';
    } else {
	const query = "SELECT COUNT(*) count, question FROM answers WHERE EXISTS (SELECT * FROM guesses WHERE guesses.name = answers.name) GROUP BY question, value;";
	let counts = {};
	for (const obj of DB.selectObjects(query)) {
	    if (!counts.hasOwnProperty(obj.question)) {
		counts[obj.question] = [];
	    }
	    counts[obj.question].push(obj.count);
	}
	let score = function(name) {
	    let vals = [0, 0];
	    if (counts.hasOwnProperty(name)) {
		vals = counts[name];
		if (vals.length == 1) vals.push(0);
	    }
	    vals.push(guessCount - vals[0] - vals[1]);
	    return Math.min(vals[0]+vals[1], vals[1]+vals[2], vals[2]+vals[0]);
	}
	GAME.remainingQuestions.sort((a, b) => (score(a) - score(b)));
	let question = GAME.remainingQuestions.pop();
	GAME.lastQuestion = question;
	let text = DB.selectValue("SELECT text FROM questions WHERE key = ?",
				  [question]);
	document.getElementById('questiontext').innerHTML = text;
	GAME.asked += 1;
    }
}

function answerYes() {
    GAME.answers.push({question: GAME.lastQuestion, answer: 'yes'});
    DB.exec("DELETE FROM guesses WHERE EXISTS (SELECT * FROM answers WHERE guesses.name = answers.name AND answers.question = ? AND answers.value = 'no');",
	    {bind: [GAME.lastQuestion]});
    askQuestion();
}

function answerNo() {
    GAME.answers.push({question: GAME.lastQuestion, answer: 'no'});
    DB.exec("DELETE FROM guesses WHERE EXISTS (SELECT * FROM answers WHERE guesses.name = answers.name AND answers.question = ? AND answers.value = 'yes');",
	    {bind: [GAME.lastQuestion]});
    askQuestion();
}

function addPerson() {
    let name = document.getElementById('name').value;
    if (name.length > 0) {
	DB.exec("INSERT INTO characters(name) VALUES(?) ON CONFLICT DO NOTHING",
		{bind: [name]});
	for (const obj of GAME.answers) {
	    DB.exec(
		"INSERT INTO answers(name, question, value) VALUES(?, ?, ?) ON CONFLICT DO NOTHING",
		{bind: [name, obj.question, obj.answer]},
	    );
	}
    }
    document.getElementById('addbox').style.display = 'none';
    document.getElementById('startgamebox').style.display = 'block';
}

function guessRight() {
    for (const obj of GAME.answers) {
	DB.exec(
	    "INSERT INTO answers(name, question, value) VALUES(?, ?, ?) ON CONFLICT DO NOTHING",
	    {bind: [GAME.guess, obj.question, obj.answer]},
	);
    }
    document.getElementById('guessbox').style.display = 'none';
    document.getElementById('gloatbox').style.display = 'block';
}

function guessWrong() {
    document.getElementById('guessbox').style.display = 'none';
    document.getElementById('addbox').style.display = 'block';
}

function playAgain() {
    document.getElementById('gloatbox').style.display = 'none';
    document.getElementById('startgamebox').style.display = 'block';
}

sqlite3InitModule().then((sqlite3) => {
    DB = new sqlite3.oo1.JsStorageDb('local');
    loadData();
    document.getElementById('loadingbox').style.display = 'none';
    document.getElementById('startgamebox').style.display = 'block';
});
