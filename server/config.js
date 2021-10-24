require('dotenv').config()

export const port = process.env.SERVER_PORT || 3000;
export const connexionString = `mongodb://${process.env.SERVER_DB_USER}:${process.env.SERVER_DB_PASSWORD}@${process.env.SERVER_DB_HOST}:${process.env.SERVER_DB_PORT}/${process.env.SERVER_DB_NAME}`;
export const baseApi =  process.env.SERVER_BASE_API; 