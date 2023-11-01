import CheckoutFacade from "../facade/checkout.facade";
import CheckoutRepository from "../repository/checkout.repository";
import AddOrderUseCase from "../usecase/place-order/place-order.usecase";
import FindOrderUseCase from "../usecase/place-order/place-order.usecase";

export default class CheckoutFacadeFactory {
  static create() {
    /*
    const repository = new CheckoutRepository();
    const findOrderUsecase = new FindOrderUseCase(repository);
    const addOrderUsecase = new AddOrderUseCase(repository);
    const facade = new CheckoutFacade({
      addOrderUsecase: addOrderUsecase,
      findOrderUsecase: findOrderUsecase,
    });

    return facade;
    */
   return "";
  }
}
