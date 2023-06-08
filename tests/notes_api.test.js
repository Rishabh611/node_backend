const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../app") // import express app
const helper = require("./testhelper")
const api = supertest(app) //wrapping of app in supertest
const Note = require("../models/note")

beforeEach(async () => {
  await Note.deleteMany({})
  await Note.insertMany(helper.initialNotes)
})
test("notes are returned as json", async () => {
  await api
    .get("/api/notes")
    .expect(200)
    .expect("Content-Type", /application\/json/)
})

test("all notes are returned", async () => {
  const response = await api.get("/api/notes")
  // execution gets here only after the HTTP request is complete
  // the result of HTTP request is saved in variable response
  expect(response.body).toHaveLength(helper.initialNotes.length)
})

test("a specific note is within the returned notes", async () => {
  const response = await api.get("/api/notes")

  const contents = response.body.map(r => r.content)
  expect(contents).toContain("Browser can execute only JavaScript")
})

test("a valid note can be added", async () => {
  const newNote = {
    content: "async/await simplifies making async calls",
    important: true
  }
  await api
    .post("/api/notes")
    .send(newNote)
    .expect(201)
    .expect("Content-Type", /application\/json/)
  const notesAtEnd = await helper.notesInDB()
  expect(notesAtEnd).toHaveLength(helper.initialNotes.length + 1)
  const contents = notesAtEnd.map(r => r.content)
  expect(contents).toContain("async/await simplifies making async calls")
})

test("note without content is not added", async () => {
  const newNote = {
    important: true
  }
  await api.post("/api/notes").send(newNote).expect(400)
  const notesAtEnd = await helper.notesInDB()
  expect(notesAtEnd).toHaveLength(helper.initialNotes.length)
}, 10000)

test("a specific note can be viewed", async () => {
  const notesAtStart = await helper.notesInDB()
  const notesToView = notesAtStart[0]
  const resultNote = await api
    .get(`/api/notes/${notesToView.id}`)
    .expect(200)
    .expect("Content-Type", /application\/json/)
  expect(resultNote.body).toEqual(notesToView)
})

test("a note can be deleted", async () => {
  const notesAtStart = await helper.notesInDB()
  const notesToDelete = notesAtStart[0]
  await api.delete(`/api/notes/${notesToDelete.id}`).expect(204)
  const notesAtEnd = await helper.notesInDB()
  expect(notesAtEnd).toHaveLength(helper.initialNotes.length - 1)
  const contents = notesAtEnd.map(r => r.content)
  expect(contents).not.toContain(notesToDelete.content)
})

afterAll(async () => {
  await mongoose.connection.close() // close the connection after all test are run
})
