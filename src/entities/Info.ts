import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "info" })
export class Info {
  @PrimaryGeneratedColumn({ type: "int" })
  id: number;

  @Column({ type: "varchar" })
  title: string;

  @Column({ type: "text" })
  description: string;

  @Column({ name: "bannerUrl", type: "varchar", nullable: true })
  bannerUrl: string;
}
