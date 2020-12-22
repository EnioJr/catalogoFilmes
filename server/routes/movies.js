const express = require("express");
const { Movie, validate, parse } = require("../model/movie"); // import

const router = express.Router();

//async (requisao pode aparecer em momento aletorio), marcio falo na aula5
router.get("/", async (request, response) => {
	try {
		let movies;

		if (request.query.title)
			movies = await Movie.find({
				title: {
					$regex: request.query.title,
					$options: "i",
				},
			});
		else if (request.query.star)
			movies = await Movie.find({
				stars: {
					$regex: request.query.star,
					$options: "i",
				},
			});
		else
			movies = await Movie.find()
				.collation({
					locale: "en",
					strength: 3,
					caseFirst: "lower",
				})
				.sort("title");

		response.json(movies);
	} catch (error) {
		response.status(500).send(error.message);
	}
});

router.post("/", async (request, response) => {
	try {
		const { error } = validate(request.body);

		if (error) return response.status(400).send(error.details[0].message);

		let movie = new Movie({
			title: request.body.title,
			imagem: request.body.imagem,
			year: request.body.year,
			format: request.body.format,
			stars: request.body.stars,
		});

		response.json(await movie.save());
	} catch (error) {
		response.status(500).send(error.message);
	}
});

router.delete("/:id", async (request, response) => {
	try {
		// Exclui um único documento com base no filtro de classificação no ( mongodb )
		const movie = await Movie.findOneAndDelete({ _id: request.params.id });

		if (!movie)
			return response
				.status(404)
				.send("O filme com o ID especificado nao foi encontrado");

		response.json(movie);
	} catch (error) {
		response.status(500).send(error.message);
	}
});

router.post("/upload", async (request, response) => {
	if (!request.files.movies)
		return response.status(400).send("Não foi possivel carregar o arquivo");

	try {
		let movies = await parse(request.files.movies.data.toString().trim());

		// insere no banco os dados do filme (mongodb)
		response.json(await Movie.insertMany(movies));
	} catch (error) {
		response.status(400).send(error.message);
	}
});

module.exports = router;
