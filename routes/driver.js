import express from "express";

import { drivers } from "../data.js";
import { randomUUID } from "node:crypto";
import {
  validateDriverInfo,
  validateUpdateDriverInfo,
  validatePosition,
} from "../inputValidation.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).send(drivers);
});

//Route Parameter ou parâmetro de rota
router.get("/standings/:position", (req, res) => {
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

router.get("/:id", (req, res) => {
  const { id } = req.params;
  const selctedDriver = drivers.find((driver) => driver.id === id);

  if (!selctedDriver) {
    res.status(404).send("Driver not found!");
    return;
  }

  res.status(200).send(selctedDriver);
});

router.post("/", (req, res) => {
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

router.put("/:id", (req, res) => {
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

router.delete("/:id", (req, res) => {
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

export default router;
