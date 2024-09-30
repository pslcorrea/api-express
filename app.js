import express from "express";
import Joi from "joi";
import { drivers, generateTeamsArray } from "./data.js";
import { randomUUID } from "node:crypto";
import {
  validateDriverInfo,
  validateUpdateDriverInfo,
  validatePosition,
} from "./inputValidation.js";

const baseAPIRoute = "/api/v1";

const app = express();

app.use(express.json());

//!Consulta de Equipes
app.get(`${baseAPIRoute}/teams`, (req, res) => {
  res.status(200).send(generateTeamsArray());
});

app.get(`${baseAPIRoute}/teams/standings/:position`, (req, res) => {
  const teams = generateTeamsArray();
  const { position } = req.params;
  const { error } = validatePosition(position, teams.length);

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

// !Consulta de Pilotos
app.get(`${baseAPIRoute}/drivers`, (req, res) => {
  res.status(200).send(drivers);
});

//Route Parameter ou parâmetro de rota
app.get(`${baseAPIRoute}/drivers/standings/:position`, (req, res) => {
  const { position } = req.params;
  const { error } = validatePosition(position, drivers.length);

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
  const { error } = validateDriverInfo(req.body);
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
  const { error } = validateUpdateDriverInfo(req.body);
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
