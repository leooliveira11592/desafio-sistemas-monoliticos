import express, { Request, Response } from "express";
import InvoiceFacadeFactory from "../../../invoice/factory/invoice.facade.factory";
import { FindInvoiceUseCaseOutputDTO } from "../../../invoice/facade/invoice.facade.interface";

export const invoiceRoute = express.Router();

invoiceRoute.get("/", async (req: Request, res: Response) => {
  try {
    
    const invoiceFacade = InvoiceFacadeFactory.create();

    var invoiceId:string = req.body.id;

    // recupera a nota
    const resultInvoice: FindInvoiceUseCaseOutputDTO = await invoiceFacade.find({ id: invoiceId });

    res.send(resultInvoice);
    
  } catch (err) {
    res.status(500).send("Erro: \n" + err);
  }
});