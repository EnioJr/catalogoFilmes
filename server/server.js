const config = require("config");

const log = require("debug")("app:log");

const express = require("express");
const helmet = require("helmet"); // ajudar a proteger o seu aplicativo de algumas vulnerabilidades
const morgan = require("morgan"); // forma de logar ou mostrar quais requisições estão chegando em nosso servidor
const fileUpload = require("express-fileupload"); //express simples para upload de arquivos.
const movies = require("./routes/movies");

const mongoose = require("mongoose");

// criaçao do server
const app = express();

mongoose
	.connect(config.get("database.uri"), { useNewUrlParser: true })
	.then(() =>
		log(
			`Successfully connected to MongoDB database on "${config.get(
				"database.uri"
			)}"`
		)
	)
	.catch((error) => log(`Cannot connect to MongoDB: ${error}`));

app.use(helmet());

// Mesmo exemplo que o mario uso, so que ele uso o bodyParser
app.use(express.json()); // Recebe informaçoes json
app.use(express.urlencoded({ extended: true })); // Recebe informaçoes (fazendo parsing do conteúdo com a biblioteca qs)
app.use(fileUpload()); // realiza o upload do file

app.use(morgan("tiny", { stream: { write: (msg) => log(msg) } }));

// (marcio crio o cors() em otra porta ), eu especifiquei para enxegar uma rota.
app.use("/api/movies/", movies);

app.listen(config.get("server.port"), config.get("server.host"), () =>
	log(
		`Server is running on ${config.get("server.host")}:${config.get(
			"server.port"
		)}`
	)
);

module.exports = app;
