import { Sequelize } from "sequelize";

/*
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: join(__dirname, '../../../database.sqlite'),
  logging: true
});
*/

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: ":memory:",
  logging: true
  // sync: { force: true }
});

// migrator(sequelize).runAsCLI();