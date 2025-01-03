import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity()
export class EventDetails {
  @PrimaryGeneratedColumn()
  id!: number;

  // Información del cliente
  @Column()
  clientName!: string;

  @Column()
  clientEmail!: string;

  @Column()
  clientPhone!: string;

  // Campos no obligatorios
  @Column({ nullable: true })
  clientAddress?: string;

  // Detalles del evento
  @Column({ nullable: true })
  eventType?: string;

  @Column({ type: "date", nullable: true })
  eventDate?: string;

  @Column({ type: "time", nullable: true })
  eventStartTime?: string;

  @Column({ type: "time", nullable: true })
  eventEndTime?: string;

  @Column({ nullable: true })
  guestCount?: number;

  // Ubicación
  @Column({ nullable: true })
  eventLocation?: string;

  @Column({ nullable: true })
  locationType?: string;

  @Column({ default: false })
  venueReserved?: boolean;

  // Servicios solicitados
  @Column({ nullable: true })
  decorationStyle?: string;

  @Column({ nullable: true })
  cateringType?: string;

  @Column({ default: false })
  includeDrinks?: boolean;

  @Column({ nullable: true })
  entertainmentType?: string;

  @Column({ default: false })
  photography?: boolean;

  @Column({ default: false })
  transportation?: boolean;

  @Column({ default: false })
  invitationManagement?: boolean;

  @Column({ nullable: true })
  otherServices?: string;

  // Presupuesto
  @Column("decimal", { precision: 10, scale: 2, nullable: true })
  budget?: number;

  @Column({ type: "simple-array", nullable: true })
  servicePriority?: string[];

  // Detalles adicionales
  @Column({ nullable: true })
  colorsOrThemes?: string;

  @Column({ nullable: true })
  specialRequirements?: string;

  @Column({ nullable: true })
  additionalComments?: string;

  // Confirmación
  @Column({ default: false })
  requiresMeeting?: boolean;

  @Column({ nullable: true })
  preferredMeetingTime?: string;

  @CreateDateColumn()
  createdAt!: Date;
}
