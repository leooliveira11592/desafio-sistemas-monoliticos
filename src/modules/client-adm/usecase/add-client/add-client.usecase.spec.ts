import { Umzug } from "umzug";
import { migrator } from "../../../../../migrations/migrator";
import { Sequelize } from "sequelize-typescript";
import Address from "../../../@shared/domain/value-object/address";
import { FindClientFacadeOutputDto } from "../../facade/client-adm.facade.interface";
import ClientAdmFacadeFactory from "../../factory/client-adm.facade.factory";
import AddClientUseCase from "./add-client.usecase";
import { ClientModel } from "../../repository/client.model";

/*
const MockRepository = () => {
  return {

    add: jest.fn(),
    find: jest.fn()
  }
}
*/

describe("Add Client use case unit test", () => {

  let sequelize: Sequelize;
  let migration: Umzug<any>;
  
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

  it("should add a client", async () => {

    /*
    const repository = MockRepository();
    const usecase = new AddClientUseCase(repository);
    */
    const clientFacade = ClientAdmFacadeFactory.create();

    const input = {
      id: "123",
      name: "Lucian",
      email: "lucian@123.com",
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

    // const result = await usecase.execute(input);
    await clientFacade.add(input);

    const client: FindClientFacadeOutputDto = await clientFacade.find({ id: input.id });

    expect(clientFacade.add).toHaveBeenCalled();
    expect(clientFacade.find).toHaveBeenCalled();
    expect(client.id).toBeDefined();
    expect(client.name).toEqual(input.name);
    expect(client.email).toEqual(input.email);
    expect(client.address).toEqual(input.address);

  })
})