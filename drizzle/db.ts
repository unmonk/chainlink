import * as schema from "./schema";
import { connect } from "@planetscale/database";
import { drizzle } from "drizzle-orm/planetscale-serverless";

//Database
const connection = connect({
  url: process.env["DATABASE_URL"],
});

export const db = drizzle(connection, {
  schema,
});
