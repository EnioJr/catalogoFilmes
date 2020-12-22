Pesquisar para selecionar e deletar tudo ao mesmo tempo.

# Catalogo de Filmes

Catalogo de Filmes was developed using MongoDB, Express.js, React.js and Node.js.

## Execution

Run server-side and client-side parts of the project:

```
$ cd server
$ npm start
```

If you want to display debug-messages, set environment variable `DEBUG`:

```
$ DEBUG=app:* npm start
```

## Movie

### Structure

| Field    | Data Type        | Required | Restrictions                                                                         |
| :------- | :--------------- | :------- | :----------------------------------------------------------------------------------- |
| `title`  | String           | Required | No longer than 100characters                                                         |
| `year`   | Number           | Required | No less than 1800 and no more than 3000                                              |
| `format` | String           | Required | `VHS` or `DVD` or `Blu-Ray`                                                          |
| `stars`  | Array of Strings | Required | Each string is no longer than 100 characters and at least one string must be present |

### Schema

```
const Movie = new mongoose.model('Movie', new mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxlength: 100
    },
    year: {
        type: Number,
        required: true,
        min: 1800,
        max: 3000
    },
    format:  {
        type: String,
        required: true,
        enum: formats
    },
    stars: {
        type: [{
            type: String,
            maxlength: 100
        }],
        required: true
    }
}));
```

### Server-Side Data Validation

Joi module is used to validate data on the server.

```
const validate = (movie) => {
    const schema = {
        title: Joi.string().max(100).required(),
        year: Joi.number().min(1800).max(3000).required(),
        format: Joi.string().valid(formats).required(),
        stars: Joi.array().items(Joi.string().max(100)).min(1).required()
    };

    return (Joi.validate(movie, schema));
};
```

## Architecture

### Server

Express.js is used for handling http-requests.

Mongoose is used for work with MongoDB.

#### RESTful API

| URL                         | HTTP Method | Body of Request | Response                                      |
| :-------------------------- | :---------- | :-------------- | :-------------------------------------------- |
| `/api/movies`               | `GET`       | —               | All movies                                    |
| `/api/movies?title=<title>` | `GET`       | —               | All movies that match `<title>`               |
| `/api/movies?star=<star>`   | `GET`       | —               | All movies which stars list contains `<star>` |
| `/api/movies`               | `POST`      | JSON            | Created movie                                 |
| `/api/movies/upload`        | `POST`      | File            | All created movies                            |
| `/api/movies/:id`           | `DELETE`    | —               | Deleted movie                                 |

### Client

React.js, Redux and Bootstrap are used to create client-side part of Movie Catalog.

![Movie Catalog](images/movie-catalog.png)
