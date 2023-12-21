import { sql } from "drizzle-orm";

import { buildDbClient, db } from "./lib/client";
import { files } from "./schema";

export { buildDbClient as buildDb, db, files as filesTable, sql };
