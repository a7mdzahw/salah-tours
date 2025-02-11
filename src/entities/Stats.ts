import { ViewEntity, ViewColumn, DataSource } from "typeorm";

@ViewEntity({
  name: "stats_view",
  expression: (dataSource: DataSource) =>
    dataSource
      .createQueryBuilder()
      .select("COUNT(DISTINCT t.id)", "totalTours")
      .addSelect("COUNT(DISTINCT c.id)", "totalCategories")
      .from("tours", "t")
      .leftJoin("categories", "c", "1=1"),
})
export class Stats {
  @ViewColumn()
  totalTours: number;

  @ViewColumn()
  totalCategories: number;

  @ViewColumn()
  totalTravelers: number;
}
