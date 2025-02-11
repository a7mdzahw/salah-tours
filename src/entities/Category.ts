import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { Tour } from "./Tour";

@Entity({ name: "categories" })
export class Category {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar" })
  name: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ name: "imageUri", nullable: true, type: "varchar" })
  imageUri: string;

  @Column({ name: "parent_category_id", nullable: true, type: "varchar" })
  parentCategoryId: string | null;

  @ManyToOne(() => Category, (category) => category.subCategories)
  @JoinColumn({ name: "parent_category_id" })
  parentCategory: Category;

  @OneToMany(() => Category, (category) => category.parentCategory)
  subCategories: Category[];

  @OneToMany(() => Tour, (tour) => tour.category)
  tours: Tour[];
}
