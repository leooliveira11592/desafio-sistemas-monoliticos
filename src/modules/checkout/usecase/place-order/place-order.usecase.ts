import Id from "../../../@shared/domain/value-object/id.value-object";
import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import ClientAdmFacadeInterface, { FindClientFacadeOutputDto } from "../../../client-adm/facade/client-adm.facade.interface";
import InvoiceFacade from "../../../invoice/facade/invoice.facade";
import InvoiceFacadeInterface from "../../../invoice/facade/invoice.facade.interface";
import PaymentFacadeInterface, { PaymentFacadeOutputDto } from "../../../payment/facade/facade.interface";
import PaymentFacade from "../../../payment/facade/payment.facade";
import ProductAdmFacadeInterface from "../../../product-adm/facade/product-adm.facade.interface";
import StoreCatalogFacade from "../../../store-catalog/facade/store-catalog.facade";
import Client from "../../domain/client.entity";
import Order from "../../domain/order.entity";
import Product from "../../domain/product.entity";
import CheckoutGateway from "../../gateway/checkout.gateway";
import { PlaceOrderInputDto, PlaceOrderOutputDto } from "./place-order.dto";

export default class PlaceOrderUseCase implements UseCaseInterface {
  private _clientFacade: ClientAdmFacadeInterface;
  private _productFacade: ProductAdmFacadeInterface;
  private _catalogFacade: StoreCatalogFacade;
  private _repository: CheckoutGateway;
  private _invoiceFacade: InvoiceFacadeInterface;
  private _paymentFacade: PaymentFacadeInterface;

  constructor(
    clientFacade: ClientAdmFacadeInterface,
    productFacade: ProductAdmFacadeInterface,
    catalogFacade: StoreCatalogFacade,
    repository: CheckoutGateway,
    invoiceFacade: InvoiceFacade,
    paymentFacade: PaymentFacade
  ) {
    this._clientFacade = clientFacade;
    this._productFacade = productFacade;
    this._catalogFacade = catalogFacade;
    this._repository = repository;
    this._invoiceFacade = invoiceFacade;
    this._paymentFacade = paymentFacade;
  }

  async execute(input: PlaceOrderInputDto): Promise<PlaceOrderOutputDto> {
    
    console.log("1 - Cliente: " + input.clientId);

    // get client
    const client = await this._clientFacade.find({ id: input.clientId });
    if (!client) {
      throw new Error("Client not found");
    }

    console.log("2 - Produto: " + input.products.length);
    // get products
    await this.validateProducts(input);

    const products = await Promise.all(
      input.products.map((p) => {
        console.log("3 - Produto: " + p.productId);
        return this.getProduct(p.productId);
      })
    );
    
    console.log("3.a - Produto: " + products.length);

    var address:string = client.address.street;

    const myClient = new Client({
      id: new Id(client.id),
      name: client.name,
      email: client.email,
      address: address,
    });

    console.log("3.b - myClient: " + myClient.name);

    const order = new Order({
      client: myClient,
      products: products,
    });

    console.log("4 - Pagamento: " + order.id.id);

    // process payment
    const payment = await this._paymentFacade.process({
      orderId: order.id.id,
      amount: order.total
    });

    console.log("5 - Nota: " + payment);

    // create the invoice and return the invoiceId
    const invoiceId: string = await Promise.resolve( this.createInvoice(client, products, payment) );

    console.log("6 - addOrder: " + payment.status);

    // add order
    if ( payment.status === "approved" && order.approved() ) {
      this._repository.addOrder(order);

      console.log("ID Pedido criado: " + order.id.id);
      console.log("Total Pedido criado: " + order.total);
    } else {
      throw new Error("Payment is not approved.");
    }

    console.log("7 - retorno: " + order.total);

    return {
      id: order.id.id,
      invoiceId: payment.status === "approved" ? (await invoiceId).toString() : null,
      status: order.status,
      total: order.total,
      products: order.products.map((p) => {
        return {
          productId: p.id.id,
        };
      }),
    };
  }

  private async validateProducts(input: PlaceOrderInputDto) {
    if (input.products.length === 0) {
      throw new Error("No products selected");
    }

    for (const p of input.products) {
      const product = await this._productFacade.checkStock({
        productId: p.productId,
      });
      if (product.stock <= 0) {
        throw new Error(
          `Product ${product.productId} is not available in stock`
        );
      }
    }
  }

  private async getProduct(productId: string): Promise<Product> {
    
    console.log("1 - getProduct: " + productId);

    const product = await this._catalogFacade.find({ id: productId });

    console.log("2 - product: " + product);

    if (!product) {
      throw new Error("Product not found");
    }

    console.log("3 - product.name: " + product.name);

    const productProps = {
      id: new Id(product.id),
      name: product.name,
      description: product.description,
      salesPrice: product.salesPrice,
    };

    const myProduct = new Product(productProps);

    return myProduct;
  }

  private async createInvoice(client: FindClientFacadeOutputDto, products: Product[], payment: PaymentFacadeOutputDto): Promise<string> {
    
    const idInvoice:Id = new Id();

    const inputInvoice = {
      id: idInvoice,
      name: client.name,
      document: client.document,
      street: client.address.street,
      number: client.address.number,
      complement: client.address.complement,
      city: client.address.city,
      state: client.address.state,
      zipCode: client.address.zipCode,
      items: products.map( (prod) => {
        return {
          id: prod.id.id,
          name: prod.name,
          price: prod.salesPrice
        };
      }),
    }

    const invoice = (payment.status === "approved") ?
        await this._invoiceFacade.generate(inputInvoice)
        : null;

    console.log("invoice: " + invoice);

    const invoiceReturn = this._invoiceFacade.find(idInvoice);
    const idRetorno: string = (await invoiceReturn).id;
    
    return idRetorno;
  }
}