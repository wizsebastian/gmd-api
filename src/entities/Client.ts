import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Order } from "./Orders.entity";

@Entity("clients")
export class Client {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 100 })
  name!: string;

  @Column({ type: "varchar", length: 100 })
  email!: string;

  @Column({ type: "varchar", length: 15, nullable: true })
  phone!: string;

  @OneToMany(() => Order, (order) => order.client)
  orders!: Order[];
}