---
name: Supabase runtime connection
description: The difference between the agent's Supabase MCP access and the app's direct PostgreSQL runtime connection.
---

The Supabase MCP connection is for agent-side inspection and SQL operations; it does not automatically replace the app's `DATABASE_URL` or provide a runtime database driver connection. A reachable app database may still be a different PostgreSQL instance from the external Supabase target, so connection availability alone does not identify the intended target.

**Why:** The app was reachable while its active schema differed from the separately inspected external database; running migrations based only on startup success could modify the wrong database.

**How to apply:** Before any DDL or data cleanup, confirm the active database using non-secret provider/schema markers and inspect its table/data counts. Configure a Supabase direct PostgreSQL URL through the secure secrets flow when Supabase is the intended target.