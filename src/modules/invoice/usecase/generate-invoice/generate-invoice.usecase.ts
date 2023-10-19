import Address from "../../../@shared/domain/value-object/address";
import Id from "../../../@shared/domain/value-object/id.value-object";
import Invoice from "../../domain/invoice.entity";
import InvoiceItems from "../../domain/invoiceitems.entity";
import InvoiceGateway from "../../gateway/invoice.gateway";
import { GenerateInvoiceInputDto, GenerateInvoiceOutputDto } from "./generate-invoice.usecase.dto";

export default class GenerateInvoiceUseCase {

  private _invoiceRepository: InvoiceGateway

  constructor(invoiceRepository: InvoiceGateway) {
    this._invoiceRepository = invoiceRepository
  }

  async execute(input: GenerateInvoiceInputDto): Promise<GenerateInvoiceOutputDto> {

    const props = {
      id: new Id(input.id) || new Id(),
      name: input.name,
      document: input.document,
      street: input.street,
      number: input.number,
      complement: input.complement,
      city: input.city,
      state: input.state,
      zipCode: input.zipCode,
      items: input.items.map( (item) =>
        new InvoiceItems({
          id: item.id,
          name: item.name,
          price: item.price,
        })
      )
    }
    
    const propsInvoice = {
      id: new Id(input.id) || new Id(),
      name: input.name,
      document: input.document,
      address: new Address(
        props.street,
        props.number,
        props.complement,
        props.city,
        props.state,
        props.zipCode,
      ),
      items: props.items
    }

    const invoice = new Invoice(propsInvoice)
    await this._invoiceRepository.generate(invoice)

    return {
      id: invoice.id.id,
      name: invoice.name,
      document: invoice.document,
      address: new Address(
        invoice.address.street,
        invoice.address.number,
        invoice.address.complement,
        invoice.address.city,
        invoice.address.state,
        invoice.address.zipCode,
      ),
      items: input.items.map( (item) =>
        new InvoiceItems({
          id: item.id,
          name: item.name,
          price: item.price,
        })
      ),
      createdAt: invoice.createdAt,
      updatedAt: invoice.updatedAt
    }
  }
}