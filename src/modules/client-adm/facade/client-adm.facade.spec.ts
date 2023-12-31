import { Umzug } from "umzug";
import { migrator } from "../../../../migrations/migrator";
import { Sequelize } from "sequelize-typescript";
import { ClientModel } from "../repository/client.model";
import ClientRepository from "../repository/client.repository";
import AddClientUseCase from "../usecase/add-client/add-client.usecase";
import ClientAdmFacade from "./client-adm.facade";
import ClientAdmFacadeFactory from "../factory/client-adm.facade.factory";
import Address from "../../@shared/domain/value-object/address";
import { FindClientFacadeOutputDto } from "./client-adm.facade.interface";

describe("Client Adm Facade test", () => {

  let sequelize: Sequelize;
  let migration: Umzug<any>;

  /*
   * comentado por ser o anterior ao migration
  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true }
    });

    sequelize.addModels([ClientModel]);
    await sequelize.sync();
  });
  */
  /*
  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ":memory:",
      logging: false
    });
    
    sequelize.addModels([ClientModel]);
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
  */

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: true,
      sync: { force: true },
    });

    await sequelize.addModels([ClientModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a client ...", async () => {

    const clientFacade = ClientAdmFacadeFactory.create();
    /*
    const repository = new ClientRepository();
    const addUsecase = new AddClientUseCase(repository);
    const facade = new ClientAdmFacade({
      addUsecase: addUsecase,
      findUsecase: undefined,
    });
    */

    const input = {
      id: "1",
      name: "Lucian 1a",
      email: "lucian@xpto.com",
      document: "1234-5678",
      address: new Address(
        "Rua 123",
        "99",
        "Casa Verde",
        "Criciúma",
        "SC",
        "88888-888",
      )
    }

    await clientFacade.add(input);

    console.log("======================== input.id: " + input.id);
    const clientReturn: FindClientFacadeOutputDto = await clientFacade.find({ id: input.id });
    const client = await ClientModel.findOne({ where: { id: "1" } });

    expect(client).toBeDefined();
    expect(clientReturn.id).toBe(input.id);
    expect(client.id).toBe(input.id);
    expect(client.name).toBe(input.name);
    expect(client.email).toBe(input.email);
    expect(client.document).toBe(input.document);
    // expect(client.address.street).toBe(input.address.street);
  })

  it("should find a client", async () => {

    // const repository = new ClientRepository()
    // const addUsecase = new AddClientUseCase(repository)
    // const findUseCase = new FindClientUseCase(repository)
    // const facade = new ClientAdmFacade({
    //   addUseCase: addUsecase,
    //   findUseCase: findUseCase
    // })

    const facade = ClientAdmFacadeFactory.create();

    const input = {
      id: "1",
      name: "Lucian",
      email: "lucian@xpto.com",
      document: "1234-5678",
      address: new Address(
        "Rua 123",
        "99",
        "Casa Verde",
        "Criciúma",
        "SC",
        "88888-888"
      )
    }

    await facade.add(input);

    const client = await facade.find({ id: "1" });

    expect(client).toBeDefined();
    expect(client.id).toBe(input.id);
    expect(client.name).toBe(input.name);
    expect(client.email).toBe(input.email);
    expect(client.document).toBe(input.document);
    expect(client.address.street).toBe(input.address.street);
    expect(client.address.number).toBe(input.address.number);
    expect(client.address.complement).toBe(input.address.complement);
    expect(client.address.city).toBe(input.address.city);
    expect(client.address.state).toBe(input.address.state);
    expect(client.address.zipCode).toBe(input.address.zipCode);
  })
})