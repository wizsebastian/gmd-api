import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("suppliers")
export class Supplier {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 100 })
  name!: string;

  @Column({ type: "varchar", length: 100 })
  email!: string;

  @Column({ type: "varchar", length: 15, nullable: true })
  phone!: string;

  @Column({ type: "text", nullable: true })
  address?: string;
  products: any;
}
