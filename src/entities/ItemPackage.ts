import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class ItemPackage {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  packageName!: string;

  @Column("decimal", { precision: 10, scale: 2 })
  price!: number;

  @Column()
  description!: string;

  @Column()
  createdBy!: string;

  @Column("simple-json") // Use "simple-json" for MySQL JSON storage
  products!: { productId: number; quantity: number }[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
