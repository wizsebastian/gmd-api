import { DataSource } from "typeorm";
import "dotenv/config";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.MYSQL_HOST, // Host de Railway
  port: Number(process.env.MYSQL_PORT), // Puerto de Railway
  username: process.env.MYSQL_USER, // Usuario de Railway
  password: process.env.MYSQL_PASSWORD, // Contraseña de Railway
  database: process.env.MYSQL_DATABASE, // Base de datos en Railway
  synchronize: true, // Usar en desarrollo, desactivar en producción
  logging: true,
  entities: ["src/entities/**/*.ts"],
});
