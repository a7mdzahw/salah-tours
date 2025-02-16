import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { Image } from "./Image";

@Entity({ name: "info" })
export class Info {
  @PrimaryGeneratedColumn({ type: "int" })
  id: number;

  @Column({ type: "varchar" })
  title: string;

  @Column({ type: "text" })
  description: string;

  @OneToOne(() => Image, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "banner_image_id" })
  bannerImage: Image | null;

  @OneToOne(() => Image, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "hero_image_id" })
  heroImage: Image | null;
}
