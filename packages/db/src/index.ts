import { sql } from "drizzle-orm";

import { buildDbClient } from "./lib/client";
import { files } from "./schema";

export { buildDbClient as db, files as filesTable, sql };
