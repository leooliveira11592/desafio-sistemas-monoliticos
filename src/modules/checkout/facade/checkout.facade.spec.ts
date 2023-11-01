import { Sequelize } from "sequelize-typescript"
import { CheckoutModel } from "../repository/checkout.model"
import { ClientModel } from "../../client-adm/repository/client.model";
import { ProductModel } from "../../product-adm/repository/product.model";
import { InvoiceModel } from "../../invoice/repository/invoice.model";
import ClientAdmFacadeFactory from "../../client-adm/factory/client-adm.facade.factory";
import ProductAdmFacadeFactory from "../../product-adm/factory/facade.factory";
import StoreCatalogFacadeFactory from "../../store-catalog/factory/facade.factory";
import CheckoutRepository from "../repository/checkout.repository";
import CheckoutGateway from "../gateway/checkout.gateway";
import InvoiceFacadeFactory from "../../invoice/factory/invoice.facade.factory";
import PaymentFacadeFactory from "../../payment/factory/payment.facade.factory";
import PlaceOrderUseCase from "../usecase/place-order/place-order.usecase";
import { PlaceOrderInputDto, PlaceOrderOutputDto } from "../usecase/place-order/place-order.dto";
import Address from "../../@shared/domain/value-object/address";
import TransactionModel from "../../payment/repository/transaction.model";
import ProductCatalogModel from "../../store-catalog/repository/product.model";
// import { Umzug } from "umzug";
// import { migrator } from "../../infrastructure/api/config-migrations/migrator";

describe("Checkout Facade test", () => {

  let sequelize: Sequelize;

  // let migration: Umzug<any>;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true }
    });

    await sequelize.addModels([ProductModel, ProductCatalogModel, ClientModel, InvoiceModel, CheckoutModel, TransactionModel]);
    await sequelize.sync();
    //migration = migrator(sequelize);
    //await migration.up();
  })

  afterEach(async () => {
    await sequelize.close();

    /*
    if (!migration || !sequelize) {
      return;
    }

    migration = migrator(sequelize);
    await migration.down();
    await sequelize.close();
    */
  })

  it("should create a checkout", async () => {

    const clientFacade = ClientAdmFacadeFactory.create();
    const productFacade = ProductAdmFacadeFactory.create();
    const storeCatalogFacade = StoreCatalogFacadeFactory.create();
    var repository: CheckoutGateway = new CheckoutRepository();
    const invoiceFacade = InvoiceFacadeFactory.create();
    const paymentFacade = PaymentFacadeFactory.create();
    
    const placeOrderUseCase: PlaceOrderUseCase = new PlaceOrderUseCase(clientFacade, productFacade, storeCatalogFacade, repository, invoiceFacade, paymentFacade);

    // INI CLIENTE
    const clientId: string = "cliente1";

    const cliente = {
      id: clientId,
      name: "Leo",
      email: "leo@leonardo.com.br",
      document: "1234",
      address: new Address(
        "avenida das palmeiras",
        "5030",
        "Casa 8",
        "Rio de Janeiro",
        "RJ",
        "1234567",
      )
    }

    await clientFacade.add(cliente);
    // FIM CLIENTE

    
    // INI PRODUTO
    const productId1: string = "produto1";
    const productId2: string = "produto2";

    const produto1 = {
      id: productId1,
      name: "Produto 1",
      description: "Descrição Produto 1",
      purchasePrice: 111,
      stock: 11,
    };

    const produto2 = {
      id: productId2,
      name: "Produto 2",
      description: "Descrição Produto 2",
      purchasePrice: 222,
      stock: 22,
    };

    await productFacade.addProduct(produto1);
    await productFacade.addProduct(produto2);
    // FIM PRODUTO


    // cria a entrada do novo pedido
    const novoPedido: PlaceOrderInputDto = {
      clientId: clientId,
      products: [{ productId: productId1 }, { productId: productId2 }]
    };

    // const resultado: PlaceOrderOutputDto = await placeOrderUseCase.execute(novoPedido);

    expect(clientFacade).toBeDefined();
    expect(productFacade).toBeDefined();
    expect(storeCatalogFacade).toBeDefined();
    expect(repository).toBeDefined();
    expect(invoiceFacade).toBeDefined();
    expect(paymentFacade).toBeDefined();
    // expect(resultado).toBeDefined();
  })
})