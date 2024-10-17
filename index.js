const express = require("express");
const http = require("http");
const dotenv = require("dotenv");
const sequelize = require("./db");
const app = express();
const router = require("./src/routes/index");
dotenv.config({ path: __dirname + "/.env" });
//Да, require не лучшая практика, но использую в рамках тестового в целях ускорения разработки

app.use(express.json());
app.use("/api/v1", router);
app.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    return res
      .status(err.status)
      .json({ success: false, message: err.message });
  }
  logger.error("Unexpected error:", err);
  return res
    .status(500)
    .json({ success: false, message: "Internal server error" });
}); //тут обрабатываю неожиданные ошибки

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync(); //тоже не лучшая практика авто-миграций, выполняется только в рамках тестового задания, в целом в больших проектах авто-миграций быть не должно ввиду того, что мы должны иметь полный контроль над миграциями/сидами, правильно их откатывать
    http
      .Server(app)
      .listen(process.env.PORT || 5000, () => console.log("start"));
  } catch (e) {
    console.log(e);
  }
};

start();

module.exports = app;
