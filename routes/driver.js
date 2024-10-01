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
router.get("/standings/:position", (req, res, next) => {
  const { position } = req.params;
  const { error } = validatePosition(position, drivers.length);

  if (error) {
    const err = new Error();
    err.statusCode = 400;
    err.description = error.details;
    return next(err);
  }

  const selctedDriver = drivers[position - 1];

  if (!selctedDriver) {
    const err = new Error();
    err.statusCode = 404;
    err.description = "posição não existe no campeonato!";
    return next(err);
  }

  res.status(200).send(selctedDriver);
});

router.get("/:id", (req, res, next) => {
  const { id } = req.params;
  const selctedDriver = drivers.find((driver) => driver.id === id);

  if (!selctedDriver) {
    const err = new Error();
    err.statusCode = 404;
    err.description = "Driver not found!";
    return next(err);
  }

  res.status(200).send(selctedDriver);
});

router.post("/", (req, res, next) => {
  const { error } = validateDriverInfo(req.body);
  if (error) {
    const err = new Error();
    err.statusCode = 400;
    err.description = error.details;
    return next(err);
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

router.put("/:id", (req, res, next) => {
  const { error } = validateUpdateDriverInfo(req.body);
  if (error) {
    const err = new Error();
    err.statusCode = 400;
    err.description = error.details;
    return next(err);
  }

  const { id } = req.params;
  const selctedDriver = drivers.find((d) => d.id === id);
  if (!selctedDriver) {
    const err = new Error();
    err.statusCode = 404;
    err.description = "Driver not found!";
    return next(err);
  }

  for (const key in selctedDriver) {
    if (req.body[key]) {
      selctedDriver[key] = req.body[key];
    }
  }

  res.status(200).send(selctedDriver);
});

router.delete("/:id", (req, res, next) => {
  const { id } = req.params;
  const selctedDriver = drivers.find((d) => d.id === id);

  if (!selctedDriver) {
    const err = new Error();
    err.statusCode = 404;
    err.description = "Driver not found!";
    return next(err);
  }

  const index = drivers.indexOf(selctedDriver);

  drivers.splice(index, 1);

  res.status(200).send(selctedDriver);
});

export default router;
