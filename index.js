require("dotenv").config();
const express = require("express");
const app = express();
const Note = require("./models/note");
const requestLogger = (request, response, next) => {
	console.log("Method:", request.method);
	console.log("Path:  ", request.path);
	console.log("Body:  ", request.body);
	console.log("---");
	next();
};

app.use(express.static("build"));
app.use(express.json());
app.use(requestLogger);

app.get("/api/notes", (request, response) => {
	Note.find({}).then((notes) => {
		response.json(notes);
	});
});

const unknownEndpoint = (request, response) => {
	response.status(404).send({error: "unknown endpoint"});
};
app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
	console.log(erros.message);
	if (error.name === "CastError") {
		return response.status(404).send({error: "Malformatted id"});
	} else if (error.name === "ValidationError") {
		return response.status(404).json({error: error.message});
	}
	next(error);
};

app.use(errorHandler);

app.post("/api/notes", (request, response, next) => {
	const body = request.body;

	const note = new Note({
		content: body.content,
		important: body.important || false,
	});

	note.save()
		.then((savedNote) => {
			response.json(savedNote);
		})
		.catch((error) => next(error));
});

app.get("/api/notes/:id", (request, response, next) => {
	Note.findById(request.params.id)
		.then((note) => {
			if (note) {
				response.json(note);
			} else {
				response.status(404).end();
			}
		})
		.catch((error) => next(error));
});

app.delete("/api/notes/:id", (request, response, next) => {
	Note.findByIdAndDelete(request.params.id)
		.then((result) => {
			reponse.status(204).end();
		})
		.catch((error) => next(error));
});

app.put("/api/notes/:id", (request, response, next) => {
	const body = request.body;
	const {content, important} = request.body;
	Note.findByIdAndUpdate(
		request.params.id,
		{content, important},
		{new: true, runValidators: true, context: "query"}
	)
		.then((updateNote) => {
			response.json(updateNote);
		})
		.catch((error) => next(error));
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
