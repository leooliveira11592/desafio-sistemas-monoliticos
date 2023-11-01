Sistemas monolíticos

----------
DESAFIO 1
----------

* Criação de módulo de Invoice


----------

Criação de módulo de Invoice


Neste desafio será necessário criar o módulo completo de invoice - Nota Fiscal do Monolito.

Para este módulo você precisa utilizar:

- Os use cases de find e generate
- Especificar todas as entradas e saídas conforme o DTO exibido ao final deste enunciado.

Os campos do invoice são:

 

id?: Id // criado automaticamente
name: string
document: string
address: Address // value object
items: InvoiceItems[] // Invoice Items entity
createdAt?: Date // criada automaticamente
updatedAt?: Date // criada automaticamente
 
A entidade InvoiceItems precisa ter:

id?: Id // criada automaticamente
name: string
price: number
Para ser considerado completo, o módulo precisa ter o facade, factory, domain, gateway, repository e usecase.

// DTO Find
export interface FindInvoiceUseCaseInputDTO {
  id: string;
}

export interface FindInvoiceUseCaseOutputDTO {
  id: string;
  name: string;
  document: string;
  address: {
    street: string;
    number: string;
    complement: string;
    city: string;
    state: string;
    zipCode: string;
  };
  items: {
    id: string;
    name: string;
    price: number;
  }[];
  total: number;
  createdAt: Date;
}

// DTO Generate
export interface GenerateInvoiceUseCaseInputDto {
  name: string;
  document: string;
  street: string;
  number: string;
  complement: string;
  city: string;
  state: string;
  zipCode: string;
  items: {
    id: string;
    name: string;
    price: number;
  }[];
}

export interface GenerateInvoiceUseCaseOutputDto {
  id: string;
  name: string;
  document: string;
  street: string;
  number: string;
  complement: string;
  city: string;
  state: string;
  zipCode: string;
  items: {
    id: string;
    name: string;
    price: number;
  }[];
  total: number;
}

* A linguagem de programação para este desafio é TypeScript




----------
DESAFIO 2
----------

* Criação de API


----------

Criação de API

Agora que temos todos os usecases, precisamos disponibilizar os endpoints para que possamos realizar uma compra.

Disponibilize os seguintes endpoints:

POST /products
POST /clients
POST /checkout/
GET /invoice/<id>

* A linguagem de programação para este desafio é TypeScript

Implemente os testes end-to-end destes endpoints com a lib supertest, ao rodar o comando "npm run test" a aplicação deve executar todos os testes. Se tiver dúvidas de como usar o supertest acesse o módulo de Clean Arch no módulo Camada de API.