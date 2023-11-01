import { Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";

interface Product {
  id: string;
  name: string;
  description: string;
  salesPrice: number;
}

interface Client {
  id: string;
  name: string;
  email: string;
  address: string;
}

@Table({
  tableName: 'checkout',
  timestamps: false
})
export class CheckoutModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  id: string;

  @Column({ allowNull: false, type: DataType.JSON })
  client: Client;

  @Column({ allowNull: false, type: DataType.JSON })
  products: Product[];

  @Column({ allowNull: false })
  createdAt: Date;

  @Column({ allowNull: false })
  updatedAt: Date;
}