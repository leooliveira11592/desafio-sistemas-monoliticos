import Address from "../../@shared/domain/value-object/address";
import Id from "../../@shared/domain/value-object/id.value-object";
import Client from "../domain/client.entity";
import Order from "../domain/order.entity";
import Product from "../domain/product.entity";
import CheckoutGateway from "../gateway/checkout.gateway";
import { CheckoutModel } from "./checkout.model";

export default class CheckoutRepository implements CheckoutGateway {

  async addOrder(entity: Order): Promise<void> {

    await CheckoutModel.create({
      id: entity.id.id,
      client: new Client({
        id: entity.client.id,
        name: entity.client.name,
        email: entity.client.email,
        address: entity.client.address
      }),
      products: entity.products.map( (item) =>
        new Product({
          id: item.id,
          name: item.name,
          description: item.description,
          salesPrice: item.salesPrice,
        })
      ),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    });
  }

  async findOrder(id: string): Promise<Order> {

    const checkout = await CheckoutModel.findOne({ where: { id } });

    if (!checkout) {
      throw new Error("Checkout not found");
    }

    return new Order({
      id: new Id(checkout.id),
      client: new Client({
        id: new Id(checkout.client.id),
        name: checkout.client.name,
        email: checkout.client.email,
        address: checkout.client.address
      }),
      products: checkout.products.map( (item) =>
        new Product({
          id: new Id(item.id),
          name: item.name,
          description: item.description,
          salesPrice: item.salesPrice,
        })
      )
    });
  }
}