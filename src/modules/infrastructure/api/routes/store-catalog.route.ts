import express, { Request, Response } from "express";
import { FindAllStoreCatalogFacadeOutputDto } from "../../../store-catalog/facade/store-catalog.facade.interface";
import StoreCatalogFacadeFactory from "../../../store-catalog/factory/facade.factory";

export const catalogRoute = express.Router();

catalogRoute.get("/", async (req: Request, res: Response) => {
  try {
    
    const storeCatalogFacade = StoreCatalogFacadeFactory.create();

    // verifica os produtos disponiveis
    const resultadoCatalogo: FindAllStoreCatalogFacadeOutputDto = await storeCatalogFacade.findAll();

    res.send(resultadoCatalogo);
    
  } catch (err) {
    res.status(500).send("Erro: \n" + err);
  }
});
