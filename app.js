import express from "express";
import { drivers } from "./data.js";
import { randomUUID } from "node:crypto";

const baseAPIRoute = "/api/v1";

const app = express();

app.use(express.json());

app.get(`${baseAPIRoute}/drivers`, (req, res) => {
  res.status(200).send(drivers);
});
app.get(`${baseAPIRoute}/drivers`, (req, res) => {
  res.status(200).send(drivers);
});
//Route Parameter ou parâmetro de rota
app.get(`${baseAPIRoute}/drivers/standings/:position`, (req, res) => {
  const { position } = req.params;
  const selctedDriver = drivers[position - 1];
  res.status(200).send(selctedDriver);
});
app.get(`${baseAPIRoute}/drivers/:id`, (req, res) => {
  const { id } = req.params;
  const selctedDriver = drivers.find((driver) => driver.id === id);
  res.status(200).send(selctedDriver);
});

app.post(`${baseAPIRoute}/drivers/`, (req, res) => {
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
  const { id } = req.params;
  const selctedDriver = drivers.find((d) => d.id === id);

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

  const index = drivers.indexOf(selctedDriver);

  drivers.splice(index, 1);

  res.status(200).send(selctedDriver);
});

const port = 3000;
app.listen(port, () => console.log("API rondando com sucesso"));
