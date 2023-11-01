import express, { Request, Response } from "express";
import ProductAdmFacadeFactory from "../../../product-adm/factory/facade.factory";
import { CheckStockFacadeOutputDto } from "../../../product-adm/facade/product-adm.facade.interface";
import Id from "../../../@shared/domain/value-object/id.value-object";

export const productRoute = express.Router();

productRoute.post("/", async (req: Request, res: Response) => {
  try {
    
    console.log("entrando produtos...");

    const productFacade = ProductAdmFacadeFactory.create();

    // cria o produto informado
    const novoProduto = {
      id: new Id().id,
      name: req.body.name,
      description: req.body.description,
      purchasePrice: req.body.purchasePrice,
      stock: req.body.stock,
    };

    const output = await productFacade.addProduct(novoProduto);
    
    res.send({
      msg: "Produto criado!",
      id: novoProduto.id,
      name: novoProduto.name
    });

  } catch (err) {
    res.status(500).send("Erro: \n" + err);
  }

  console.log("saindo produtos...");
});

productRoute.get("/", async (req: Request, res: Response) => {
  try {
    
    const productFacade = ProductAdmFacadeFactory.create();

    var idProduto:string = req.body.id;

    // verifica o estoque do produto
    const resultadoEstoque: CheckStockFacadeOutputDto = await productFacade.checkStock({ productId: idProduto });

    res.send(resultadoEstoque);
    
  } catch (err) {
    res.status(500).send("Erro: \n" + err);
  }
});
