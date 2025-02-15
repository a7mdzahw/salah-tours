import "reflect-metadata";
import { DataSource } from "typeorm";
import { Tour } from "@entities/Tour";
import { TourDay } from "@entities/TourDay";
import { Category } from "@entities/Category";
import { Info } from "@entities/Info";
import { Stats } from "@entities/Stats";
import { File } from "@entities/File";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  synchronize: true,
  logging: process.env.NODE_ENV === "development",
  entities: [Tour, TourDay, Category, Info, Stats, File],
});

let initialized = false;

export async function initializeDB() {
  if (!initialized) {
    try {
      await AppDataSource.initialize();
      console.log("Data Source has been initialized!");
      initialized = true;
    } catch (err) {
      console.error("Error during Data Source initialization:", err);
      throw err;
    }
  }
  return AppDataSource;
}
