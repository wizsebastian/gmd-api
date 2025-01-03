import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Order } from "./Orders.entity";

@Entity("order_items")
export class OrderItem {
  @PrimaryGeneratedColumn()
  order_item_id!: number;

  @ManyToOne(() => Order, (order: Order) => order.order_items, { onDelete: "CASCADE" })
  order!: Order;

  @Column({ type: "varchar", length: 20 })
  item_type!: string;

  // Cambiado de number a string para soportar UUIDs
  @Column({ type: "varchar", length: 36 })
  item_id!: string;

  @Column({ type: "int" })
  quantity!: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  unit_price!: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  subtotal?: number;

  @Column({ type: "text", nullable: true })
  notes?: string;
}