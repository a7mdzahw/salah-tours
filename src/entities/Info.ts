import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { File } from "./File";

@Entity({ name: "info" })
export class Info {
  @PrimaryGeneratedColumn({ type: "int" })
  id: number;

  @Column({ type: "varchar" })
  title: string;

  @Column({ type: "text" })
  description: string;

  @OneToOne(() => File, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "banner_image_id" })
  bannerImage: File | null;

  @OneToOne(() => File, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "hero_image_id" })
  heroImage: File | null;
}
