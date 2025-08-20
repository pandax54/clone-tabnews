/* eslint-disable @typescript-eslint/naming-convention */

exports.up = async function up(pgm) {
  // Add UUID extension if not exists
  pgm.createExtension("uuid-ossp", { ifNotExists: true });

  // Create enum type for user roles
  pgm.createType("user_role", ["user", "admin"]);

  pgm.createTable("users", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("uuid_generate_v4()"),
    },
    name: { type: "varchar(255)", notNull: true },
    email: { type: "varchar(50)", notNull: true, unique: true },
    password: { type: "varchar(255)", notNull: true },
    role: { type: "user_role", notNull: true, default: "user" },
    createdAt: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
    updatedAt: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
    deletedAt: {
      type: "timestamp",
      notNull: false,
    },
  });
};

exports.down = async function down(pgm) {
  pgm.dropTable("users");
};
