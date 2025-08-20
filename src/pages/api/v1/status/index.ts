import type { NextApiRequest, NextApiResponse } from "next";
import db from "@infra/config/database";

export default async function status(
  _request: NextApiRequest,
  response: NextApiResponse,
) {
  const versionQuery = await db.getPostgresVersion();
  const maxConnectionsQuery = await db.getMaxConnections();
  const openedConnectionsQuery = await db.getOpenedConnections(String(process.env.POSTGRES_DATABASE));

  response.status(200).json({
    updated_at: new Date().toISOString(),
    // updated_at: null,
    dependencies: {
      database: {
        version: versionQuery,
        max_connections: maxConnectionsQuery,
        opened_connections: openedConnectionsQuery,
      },
    },
  });
}
