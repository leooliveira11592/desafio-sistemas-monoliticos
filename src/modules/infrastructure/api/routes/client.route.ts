import express, { Request, Response } from "express";
import ClientAdmFacadeFactory from "../../../client-adm/factory/client-adm.facade.factory";
import Address from "../../../@shared/domain/value-object/address";
import Id from "../../../@shared/domain/value-object/id.value-object";

export const clientRoute = express.Router();

clientRoute.post("/", async (req: Request, res: Response) => {
  try {
    
    console.log("entrando clients...");

    const clientFacade = ClientAdmFacadeFactory.create();

    // cria o cliente informado
    const novoCliente = {
      id: new Id().id,
      name: req.body.name,
      email: req.body.email,
      document: req.body.document,
      address: new Address(
        req.body.street,
        req.body.number,
        req.body.complement,
        req.body.city,
        req.body.state,
        req.body.zipCode,
      )
    }

    console.log("Cliente: \n" + novoCliente);

    const output = await clientFacade.add(novoCliente);

    res.send({
      msg: "Cliente criado!",
      id: novoCliente.id,
      name: novoCliente.name
    });

  } catch (err) {
    console.log("Erro clients: " + err);
    res.status(500).send("Erro: \n" + err);
  }

  console.log("saindo clients...");
});

clientRoute.get("/", async (req: Request, res: Response) => {
  try {
    
    console.log("entrando clients...");

    const clientFacade = ClientAdmFacadeFactory.create();

    var idCliente:string = req.body.id;

    const output = await clientFacade.find({ id: idCliente });

    res.send(output);
    
  } catch (err) {
    console.log("Erro clients: " + err);
    res.status(500).send("Erro: \n" + err);
  }

  console.log("saindo clients...");
});
