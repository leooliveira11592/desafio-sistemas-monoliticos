import { Sequelize } from "sequelize-typescript"
import { InvoiceModel } from "../repository/invoice.model"
import InvoiceFacadeFactory from "../factory/invoice.facade.factory"

describe("Invoice Facade test", () => {

  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true }
    });

    sequelize.addModels([InvoiceModel])
    await sequelize.sync();
  })

  afterEach(async () => {
    await sequelize.close();
  })

  it("should create a invoice", async () => {
    /*
    const repository = new InvoiceRepository()
    const generateUsecase = new GenerateInvoiceUseCase(repository)
    const facade = new InvoiceFacade({
      generateUsecase: generateUsecase,
      findUsecase: undefined,
    });
    */
    const facade = InvoiceFacadeFactory.create();

    const input = {
      id: "1",
      name: "Lucian",
      document: "1234-5678",
      street: "Rua 123",
      number: "99",
      complement: "Casa Verde",
      city: "Criciúma",
      state: "SC",
      zipCode: "88888-888",
      items: [
        ({
          id: "111",
          name: "nota 111",
          price: 100
        }),
        ({
          id: "222",
          name: "nota 222",
          price: 200
        })
      ]
    }

    await facade.generate(input);
    const invoice = await facade.find({ id: "1" });

    expect(invoice).toBeDefined();
    expect(invoice.id).toBe(input.id);
    expect(invoice.name).toBe(input.name);
    expect(invoice.document).toBe(input.document);
    expect(invoice.address.city).toBe(input.city);
    expect(invoice.address.street).toBe(input.street);
    expect(invoice.items[0].id).toBe(input.items[0].id);
  })

  it("should find a invoice", async () => {

    const facade = InvoiceFacadeFactory.create();

    const input = {
      id: "12",
      name: "Lucian",
      document: "1234-5678",
      street: "Rua 123",
      number: "99",
      complement: "Casa Verde",
      city: "Criciúma",
      state: "SC",
      zipCode: "88888-888",
      items: [(
        {
          id: "1",
          name: "nota 1",
          price: 100
        }
      )]
    }

    await facade.generate(input);
    const invoice = await facade.find({ id: "12" });

    // console.log("invoice: " + JSON.stringify(invoice) );

    expect(invoice).toBeDefined();
    expect(invoice.id).toBe(input.id);
    expect(invoice.name).toBe(input.name);
    expect(invoice.document).toBe(input.document);
    expect(invoice.address.street).toBe(input.street);
    expect(invoice.items.length).toEqual(1);
    expect(invoice.items[0].name).toBe(input.items[0].name);
  })
})