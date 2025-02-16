import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  OneToOne,
} from "typeorm";
import { Tour } from "./Tour";
import { Image } from "./Image";
@Entity({ name: "categories" })
export class Category {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar" })
  name: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @OneToOne(() => Image, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "category_image_id" })
  image: Image | null;

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
