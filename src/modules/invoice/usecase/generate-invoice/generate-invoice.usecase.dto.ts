import Address from "../../../@shared/domain/value-object/address"
import InvoiceItems from "../../domain/invoiceitems.entity"

export interface GenerateInvoiceInputDto {
  id?: string
  name: string
  document: string
  street: string
  number: string
  complement: string
  city: string
  state: string
  zipCode: string
  items: InvoiceItems[]
}

export interface GenerateInvoiceOutputDto {
  id: string
  name: string
  document: string
  address: Address
  items: InvoiceItems[]
  createdAt: Date
  updatedAt: Date
}