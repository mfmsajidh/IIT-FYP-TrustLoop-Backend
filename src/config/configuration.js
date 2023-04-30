import * as dotenv from "dotenv";

dotenv.config()
export const ENVIRONMENT = {
    jwtKey: process.env.JWT_KEY,
    environment: process.env.NODE_ENV,
    port: process.env.PORT,
    dbString: process.env.DB_CONNECTION_STRING,
    dbName: process.env.DB_NAME
}
