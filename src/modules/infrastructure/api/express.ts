import { Umzug } from "umzug";
import { migrator } from "../../../../migrations/migrator"
import { Sequelize } from "sequelize-typescript";
import express, { Express } from "express";
import { ProductModel } from "../../product-adm/repository/product.model";
import { ClientModel } from "../../client-adm/repository/client.model";
import { InvoiceModel } from "../../invoice/repository/invoice.model";
import { productRoute } from "./routes/product.route";
import { clientRoute } from "./routes/client.route";
import { checkoutRoute } from "./routes/checkout.route";
import { invoiceRoute } from "./routes/invoice.route";
import { catalogRoute } from "./routes/store-catalog.route";
import { CheckoutModel } from "../../checkout/repository/checkout.model";
import TransactionModel from "../../payment/repository/transaction.model";
import ProductCatalogModel from "../../store-catalog/repository/product.model";

export const app: Express = express();

app.use( express.urlencoded() );
app.use( express.json() );
app.use("/products", productRoute);
app.use("/clients", clientRoute);
app.use("/checkout", checkoutRoute);
app.use("/invoice", invoiceRoute);
app.use("/catalog", catalogRoute);

export let sequelize: Sequelize;

let migration: Umzug<any>;

async function setupDb() {
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
    logging: false
    // sync: { force: true }
  });

  await sequelize.addModels([ProductModel, ProductCatalogModel, ClientModel, InvoiceModel, CheckoutModel, TransactionModel]);

  migration = migrator(sequelize);
  await migration.up();

  // await sequelize.sync();
}

setupDb();
