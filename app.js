import express from "express";
import driversRouter from "./routes/driver.js";
import teamsRouter from "./routes/team.js";
import helmet from "helmet";

const baseAPIRoute = "/api/v1";

const app = express();

app.use(express.json());
//? Gera cabeçalhos de proteção para respostas HTTP
app.use(helmet());
app.use(baseAPIRoute + "/drivers", driversRouter);
app.use(baseAPIRoute + "/teams", teamsRouter);

// ! Quando o midware tiver 04 parametros o express
// !Vai entender o o primeiro paramentro é o erro.
app.use((error, req, res, next) => {
  res.status(error.statusCode ?? 500).send(error);
});

const port = 3000;
app.listen(port, () => console.log("API rondando com sucesso"));
