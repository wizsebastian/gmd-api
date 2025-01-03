import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, OneToOne } from "typeorm";
import { Client } from "./Client";
import { OrderItem } from "./Order-item.entity";
import { OrderDetails } from "./OrdersDetails";

@Entity("orders")
export class Order {
  @PrimaryGeneratedColumn()
  order_id!: number;

  @ManyToOne(() => Client, (client) => client.orders, { onDelete: "CASCADE" })
  client!: Client;

  @Column({ type: "varchar", length: 20 })
  status!: string;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  total!: number;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @OneToMany(() => OrderItem, (orderItem: OrderItem) => orderItem.order, {
    cascade: true,
  })
  order_items!: OrderItem[];

  @OneToOne(() => OrderDetails, (orderDetails) => orderDetails.order, {
    cascade: true,
  })
  orderDetails!: OrderDetails;
}