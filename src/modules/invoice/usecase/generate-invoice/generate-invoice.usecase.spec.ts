import Id from "../../../@shared/domain/value-object/id.value-object"
import InvoiceItems from "../../domain/invoiceitems.entity"
import GenerateInvoiceUseCase from "./generate-invoice.usecase"

const MockRepository = () => {
  return {
    generate: jest.fn(),
    find: jest.fn()
  }
}

describe("Generate Invoice use case unit test", () => {

  it("should generate a invoice", async () => {

    const repository = MockRepository();
    const usecase = new GenerateInvoiceUseCase(repository);

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
      items: [new InvoiceItems(
        {
          id: new Id("111"),
          name: "nota 111",
          price: 100
        }
      )]
    }

    const result = await usecase.execute(input);

    expect(repository.generate).toHaveBeenCalled();
    expect(result.id).toBeDefined();
    expect(result.name).toEqual(input.name);
    expect(result.document).toEqual(input.document);
    expect(result.address.street).toEqual(input.street);
    expect(result.items[0].name).toEqual(input.items[0].name);
    expect(result.items[0].price).toEqual(input.items[0].price);

  })
})