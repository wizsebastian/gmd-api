import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { Order } from "./Orders.entity";

@Entity("order_details")
export class OrderDetails {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  recipientName!: string;

  @Column()
  senderName!: string;

  @Column({ nullable: true })
  allergies?: string;

  @Column()
  cardMessage!: string;

  @Column()
  deliveryAddress!: string;

  @Column({ nullable: true })
  deliveryLocation?: string;

  @Column()
  referenceContact!: string;

  @OneToOne(() => Order, (order) => order.orderDetails)
  @JoinColumn()
  order!: Order;
}