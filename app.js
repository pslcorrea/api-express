import express from "express";
import Joi from "joi";
import { drivers, generateTeamsArray } from "./data.js";
import { randomUUID } from "node:crypto";

const baseAPIRoute = "/api/v1";

const app = express();

app.use(express.json());

app.get(`${baseAPIRoute}/teams`, (req, res) => {
  res.status(200).send(generateTeamsArray());
});

app.get(`${baseAPIRoute}/teams/standings/:position`, (req, res) => {
  const teams = generateTeamsArray();
  const positionSchema = Joi.number().min(1).max(teams.length);
  const { position } = req.params;
  const { error } = positionSchema.validate(position);

  if (error) {
    res.status(400).send(error);
    return;
  }

  const selctedTeam = teams[position - 1];

  if (!selctedTeam) {
    res.status(404).send("Posição não existe no campeonato!");
    return;
  }

  res.status(200).send(selctedTeam);
});

app.get(`${baseAPIRoute}/drivers`, (req, res) => {
  res.status(200).send(drivers);
});

//Route Parameter ou parâmetro de rota
app.get(`${baseAPIRoute}/drivers/standings/:position`, (req, res) => {
  const positionSchema = Joi.number().min(1).max(drivers.length);
  const { position } = req.params;
  const { error } = positionSchema.validate(position);

  if (error) {
    res.status(400).send(error);
    return;
  }

  const selctedDriver = drivers[position - 1];

  if (!selctedDriver) {
    res.status(404).send("Posição não existe no campeonato!");
    return;
  }

  res.status(200).send(selctedDriver);
});

app.get(`${baseAPIRoute}/drivers/:id`, (req, res) => {
  const { id } = req.params;
  const selctedDriver = drivers.find((driver) => driver.id === id);

  if (!selctedDriver) {
    res.status(404).send("Driver not found!");
    return;
  }

  res.status(200).send(selctedDriver);
});

app.post(`${baseAPIRoute}/drivers/`, (req, res) => {
  const driverSchema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    team: Joi.string().min(3).max(50).required(),
    points: Joi.number().min(0).max(1000).default(0),
  });

  const { error } = driverSchema.validate(req.body, { abortEarly: false });
  if (error) {
    res.status(400).send(error);
    return;
  }

  const newDriver = { ...req.body, id: randomUUID() };
  drivers.push(newDriver);
  drivers.sort((b, a) => {
    if (a.points > b.points) {
      return 1;
    }
    if (b.points > a.points) {
      return -1;
    }
    return 0;
  });
  res.status(200).send(newDriver);
});

app.put(`${baseAPIRoute}/drivers/:id`, (req, res) => {
  const updateDriverSchema = Joi.object({
    name: Joi.string().min(3).max(50),
    team: Joi.string().min(3).max(50),
    points: Joi.number().min(0).max(1000),
  }).min(1);
  const { error } = updateDriverSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    res.status(400).send(error);
    return;
  }

  const { id } = req.params;
  const selctedDriver = drivers.find((d) => d.id === id);
  if (!selctedDriver) {
    res.status(404).send("Driver not found!");
    return;
  }

  for (const key in selctedDriver) {
    if (req.body[key]) {
      selctedDriver[key] = req.body[key];
    }
  }

  res.status(200).send(selctedDriver);
});

app.delete(`${baseAPIRoute}/drivers/:id`, (req, res) => {
  const { id } = req.params;
  const selctedDriver = drivers.find((d) => d.id === id);

  if (!selctedDriver) {
    res.status(404).send("Driver not found!");
    return;
  }

  const index = drivers.indexOf(selctedDriver);

  drivers.splice(index, 1);

  res.status(200).send(selctedDriver);
});

const port = 3000;
app.listen(port, () => console.log("API rondando com sucesso"));
