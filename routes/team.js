import express from "express";

import { generateTeamsArray } from "../data.js";
import { validatePosition } from "../inputValidation.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).send(generateTeamsArray());
});

router.get("/standings/:position", (req, res, next) => {
  const teams = generateTeamsArray();
  const { position } = req.params;
  const { error } = validatePosition(position, teams.length);

  if (error) {
    const err = new Error();
    err.statusCode = 400;
    err.description = error.details;
    return next(err);
  }

  const selctedTeam = teams[position - 1];

  if (!selctedTeam) {
    const err = new Error();
    err.statusCode = 404;
    err.description = "posição não existe no campeonato!";
    return next(err);
  }

  res.status(200).send(selctedTeam);
});

export default router;
