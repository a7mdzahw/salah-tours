import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Tour } from "./Tour";

@Entity({ name: "tour_days" })
export class TourDay {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "int" })
  day: number;

  @Column({ type: "varchar" })
  title: string;

  @Column({ type: "text" })
  description: string;

  @Column({ name: "tour_id", type: "string" })
  tourId: string;

  @ManyToOne(() => Tour, (tour) => tour.days, { onDelete: "CASCADE" })
  @JoinColumn({ name: "tour_id" })
  tour: Tour;
}
