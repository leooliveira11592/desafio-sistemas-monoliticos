import { Umzug } from "umzug";
import { migrator } from "../../../../migrations/migrator";
import { Sequelize } from "sequelize-typescript";
import { CheckoutModel } from "./checkout.model";
import CheckoutRepository from "./checkout.repository";
import Id from "../../@shared/domain/value-object/id.value-object";
import Client from "../domain/client.entity";
import Order from "../domain/order.entity";
import Product from "../domain/product.entity";

describe("Checkout Repository test", () => {

  let sequelize: Sequelize;
  let migration: Umzug<any>;

  /*
  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true }
    });

    sequelize.addModels([CheckoutModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });
  */

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ":memory:",
      logging: false
    });
    
    sequelize.addModels([CheckoutModel]);
    migration = migrator(sequelize);
    await migration.up();
  });

  afterEach(async () => {

    if (!migration || !sequelize) {
      return ;
    }

    migration = migrator(sequelize);
    await migration.down();
    await sequelize.close();

  });

  it("should create a checkout", async () => {

    const order = new Order({
      id: new Id("1"),
      client: new Client(
        {
        id: new Id("1"),
        name: "Leonardo",
        email: "leo@leonardo.com.br",
        address: "rua ABC, casa 10"
        }
      ),
      products: [
        new Product({id: new Id("1"), name: "Produto 1", description: "descricao do Produto 1", salesPrice: 100}),
        new Product({id: new Id("2"), name: "Produto 2", description: "descricao do Produto 2", salesPrice: 200})
      ]
    });

    const repository = new CheckoutRepository();
    await repository.addOrder(order);

    const result: CheckoutModel = await CheckoutModel.findOne({ where: { id: "1" } });

    expect(result).toBeDefined();
    expect(result.id).toEqual(order.id.id);
  })

  it("should find a checkout", async () => {

    const order = new Order({
      id: new Id("1"),
      client: new Client(
        {
          id: new Id("1"),
          name: "Leonardo",
          email: "leo@leonardo.com.br",
          address: "rua ABC, casa 10"
        }
      ),
      products: [
        new Product({id: new Id("1"), name: "Produto 1", description: "descricao do Produto 1", salesPrice: 100}),
        new Product({id: new Id("2"), name: "Produto 2", description: "descricao do Produto 2", salesPrice: 200})
      ]
    });
    
    const repository = new CheckoutRepository();
    await repository.addOrder(order);

    
    const result = await repository.findOrder(order.id.id);

    expect(result).toBeDefined();
    expect(repository).toBeDefined();
    expect(result.id.id).toEqual(order.id.id);
  })
})