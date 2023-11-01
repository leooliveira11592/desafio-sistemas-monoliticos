import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import CheckoutFacadeInterface, {
  AddOrderUseCaseInputDto,
  FindOrderUseCaseInputDTO,
  FindOrderUseCaseOutputDTO,
} from "./checkout.facade.interface";

export interface UseCaseProps {
  findOrderUsecase: UseCaseInterface;
  addOrderUsecase: UseCaseInterface;
}

export default class CheckoutFacade implements CheckoutFacadeInterface {
  private _findOrderUsecase: UseCaseInterface;
  private _addOrderUsecase: UseCaseInterface;

  constructor(usecaseProps: UseCaseProps) {
    this._findOrderUsecase = usecaseProps.findOrderUsecase;
    this._addOrderUsecase = usecaseProps.addOrderUsecase;
  }

  async addOrder(input: AddOrderUseCaseInputDto): Promise<void> {
    await this._addOrderUsecase.execute(input);
  }
  
  async findOrder(
    input: FindOrderUseCaseInputDTO
  ): Promise<FindOrderUseCaseOutputDTO> {
    return await this._findOrderUsecase.execute(input);
  }
}
