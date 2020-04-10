const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function verifyIfIdExist(request,response,next){
  const {id} = request.params;
  const rep = repositories.find(r=>r.id===id);
  if (!rep) return response.status(400).send('Bad request');
  next();
}

app.use('/repositories/:id/*',verifyIfIdExist);
app.use('/repositories/:id',verifyIfIdExist);

app.get("/repositories", (request, response) => {
  return response.status(200).send(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const id = uuid();
  const repository = {id,title, url, techs, likes: 0};
  repositories.push(repository);
  return response.status(200).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const {title,url,techs} = request.body;
  const {id} = request.params;
  const rep = repositories.find(r=>r.id===id);
  if(title) rep.title = title;
  if(url) rep.url = url;
  if(techs) rep.techs = techs;
  return response.status(200).json(rep);
});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const index = repositories.findIndex(r=>r.id===id);
  repositories.splice(index,1);
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params;
  const rep = repositories.find(r=>r.id===id);
  rep.likes += 1;
  return response.status(200).json(rep);
});

module.exports = app;
