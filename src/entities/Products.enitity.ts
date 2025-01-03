import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Supplier } from "./Supplier.entity";

@Entity("products")
export class Product {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 100 })
  productName!: string;

  @Column({ type: "decimal" })
  price!: number;

  @Column({ type: "int" })
  quantity!: number;

  @ManyToOne(() => Supplier, (supplier) => supplier.products, { nullable: false, onDelete: "CASCADE" })
  supplier!: Supplier;
}