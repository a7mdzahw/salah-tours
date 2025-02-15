import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { Category } from "./Category";
import { TourDay } from "./TourDay";
import { File } from "./File";

@Entity({ name: "tours" })
export class Tour {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar" })
  name: string;

  @Column({ type: "text" })
  description: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  price: number;

  @Column({ type: "int" })
  duration: number;

  @Column({ name: "category_id", type: "string" })
  categoryId: string;

  @OneToMany(() => File, (file) => file.tour, {
    onDelete: "SET NULL",
    nullable: true,
  })
  catalogImages: File[];

  @ManyToOne(() => Category, (category) => category.tours)
  @JoinColumn({ name: "category_id" })
  category: Category;

  @OneToMany(() => TourDay, (day) => day.tour, { cascade: true })
  days: TourDay[];
}
