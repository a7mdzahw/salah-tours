import "reflect-metadata";
import { DataSource } from "typeorm";
import { Tour } from "@entities/Tour";
import { TourDay } from "@entities/TourDay";
import { Category } from "@entities/Category";
import { Info } from "@entities/Info";
import { Stats } from "@entities/Stats";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false,
  },
  synchronize: true,
  logging: process.env.NODE_ENV === "development",
  entities: [Tour, TourDay, Category, Info, Stats],
  subscribers: [],
  migrations: [],
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