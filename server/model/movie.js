const Joi = require("joi"); // faz a validaçao dos dados (request)
const mongoose = require("mongoose");

const formats = ["VHS", "DVD", "Blu-Ray"];

//Instacia do movie. (preenchimento dos dados)
const Movie = new mongoose.model(
	"Movie",
	new mongoose.Schema({
		title: {
			type: String,
			required: true,
			maxlength: 100,
		},
		imagem: {
			type: String,
			required: true,
			maxlength: 900,
		},
		year: {
			type: Number,
			required: true,
			min: 1800,
			max: 3000,
		},
		format: {
			type: String,
			required: true,
			enum: formats,
		},
		stars: {
			type: [
				{
					type: String,
					maxlength: 100,
				},
			],
			required: true,
		},
	})
);

//So pra ter ctz, confirmar que os dados estao todos corretos.
const validate = (movie) => {
	const schema = {
		title: Joi.string().max(100).required(),
		imagem: Joi.string().max(900).required(),
		year: Joi.number().min(1800).max(3000).required(),
		format: Joi.string().valid(formats).required(),
		stars: Joi.array().items(Joi.string().max(100)).min(1).required(),
	};

	return Joi.validate(movie, schema);
};

//Ajuste do file
const parse = (file) => {
	return new Promise((resolve) => {
		let moviesArray = [];
		let movies = file.replace(/(\r\n|\n|\r)/gm, "\n").split(/^\s*\n/gm);
		let pattern = /Title:\s*(.+?)\s*\nImagem:\s*(.+?)\s*\nRelease Year:\s*(\d{4})\s*\nFormat:\s*(VHS|DVD|Blu-Ray)\s*\nStars:\s*(.*)/;

		movies.forEach((str) => {
			if (pattern.test(str)) {
				const result = pattern.exec(str);

				const movie = {
					title: result[1],
					imagem: result[2],
					year: parseInt(result[3], 10),
					format: result[4],
					stars: result[5].split(", ").map((name) => name.trim()),
				};

				const { error } = validate(movie);

				if (error) throw new Error("Invalid file");

				moviesArray.push(movie);
			} else {
				throw new Error("Invalid file");
			}
		});
		resolve(moviesArray);
	});
};

module.exports = {
	Movie,
	validate,
	parse,
};
