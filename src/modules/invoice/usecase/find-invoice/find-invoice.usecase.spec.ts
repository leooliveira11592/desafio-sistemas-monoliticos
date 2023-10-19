import Address from "../../../@shared/domain/value-object/address"
import Id from "../../../@shared/domain/value-object/id.value-object"
import InvoiceItems from "../../domain/invoiceitems.entity"
import FindInvoiceUseCase from "./find-invoice.usecase"

const invoice = ({
  id: new Id("1"),
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
  ),
  items: [
    new InvoiceItems({id: new Id("1"), name: "nota 1", price: 100}),
    new InvoiceItems({id: new Id("2"), name: "nota 2", price: 200})
  ]
});

const MockRepository = () => {

  return {
    generate: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(invoice))
  }
}

describe("Find Invoice use case unit test", () => {

  it("should find a invoice", async () => {

    const repository = MockRepository();
    const usecase = new FindInvoiceUseCase(repository);

    const inputFind = {
      id: "1"
    }

    const result = await usecase.execute(inputFind);

    expect(repository.find).toHaveBeenCalled();
    expect(result.name).toEqual(invoice.name);
    expect(result.document).toEqual(invoice.document);
    expect(result.address).toEqual(invoice.address);
    expect(result.items[0].name).toEqual(invoice.items[0].name);
    expect(result.items[1].name).toEqual(invoice.items[1].name);
    expect(result.items[0].price).toEqual(invoice.items[0].price);
    expect(result.items[1].price).toEqual(invoice.items[1].price);
  })
})