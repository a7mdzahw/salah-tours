import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Tour } from "./Tour";

@Entity()
export class File {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column({ type: "varchar" })
  url: string;

  @Column({ type: "varchar" })
  filename: string;

  @Column({ type: "int" })
  size: number;

  @Column({ type: "varchar" })
  mimeType: string;

  @ManyToOne(() => Tour, (tour) => tour.catalogImages, {
    onDelete: "CASCADE",
    nullable: true,
  })
  @JoinColumn({ name: "tour_id" })
  tour: Tour;
}
