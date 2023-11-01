import express, { Request, Response } from "express";
import ClientAdmFacadeFactory from "../../../client-adm/factory/client-adm.facade.factory";
import ProductAdmFacadeFactory from "../../../product-adm/factory/facade.factory";
import CheckoutGateway from "../../../checkout/gateway/checkout.gateway";
import PlaceOrderUseCase from "../../../checkout/usecase/place-order/place-order.usecase";
import StoreCatalogFacadeFactory from "../../../store-catalog/factory/facade.factory";
import { PlaceOrderInputDto } from "../../../checkout/usecase/place-order/place-order.dto";
import InvoiceFacadeFactory from "../../../invoice/factory/invoice.facade.factory";
import PaymentFacadeFactory from "../../../payment/factory/payment.facade.factory";
import CheckoutRepository from "../../../checkout/repository/checkout.repository";

export const checkoutRoute = express.Router();

checkoutRoute.post("/", async (req: Request, res: Response) => {
  try {

    console.log("entrando checkout...");

    const clientFacade = ClientAdmFacadeFactory.create();
    const productFacade = ProductAdmFacadeFactory.create();
    const storeCatalogFacade = StoreCatalogFacadeFactory.create();
    var repository: CheckoutGateway = new CheckoutRepository();
    const invoiceFacade = InvoiceFacadeFactory.create();
    const paymentFacade = PaymentFacadeFactory.create();
    
    const placeOrderUseCase: PlaceOrderUseCase = new PlaceOrderUseCase(clientFacade, productFacade, storeCatalogFacade, repository, invoiceFacade, paymentFacade);

    
    const clientId: string = req.body.id_client;
    const productId1:string = req.body.id_product_1;
    const productId2:string = req.body.id_product_2;

    // cria a entrada do novo pedido
    const novoPedido: PlaceOrderInputDto = {
      clientId: clientId,
      products: [{ productId: productId1 }, { productId: productId2 }]
    };

    const output = await placeOrderUseCase.execute(novoPedido);

    res.send("Pedido realizado.");
    
  } catch (err) {
    console.log("Erro checkout: " + err);
    res.status(500).send("Erro: \n" + err);
  }

  console.log("saindo checkout...");
});
