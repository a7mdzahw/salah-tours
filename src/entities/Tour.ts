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

@Entity({ name: "tours" })
export class Tour {
  @PrimaryGeneratedColumn({ type: "int" })
  id: number;

  @Column({ type: "varchar" })
  name: string;

  @Column({ type: "text" })
  description: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  price: number;

  @Column({ type: "int" })
  duration: number;

  @Column({ name: "category_id", type: "int" })
  categoryId: number;

  @Column({ type: "varchar", nullable: true })
  image: string;

  @Column("simple-array", { nullable: true })
  catalogImages: string[];

  @ManyToOne(() => Category, (category) => category.tours)
  @JoinColumn({ name: "category_id" })
  category: Category;

  @OneToMany(() => TourDay, (day) => day.tour, { cascade: true })
  days: TourDay[];
}
