const typeormConfig = {
  "ssl": true,
  "extra": {
    "ssl":{
      "rejectUnauthorized": false
    }
  },
  "type": "postgres",
  "database": process.env.DATABASE,
  "username": process.env.DATABASE_USERNAME,
  "port": "5432",
  "password": process.env.PASSWORD,
  "host": process.env.HOST,
  "migrations": ["./src/database/migrations/**.ts"],
  "entities": ["./src/models/**.ts"],
  "cli": {
    "migrationsDir": "./src/database/migrations/"
  }
}

module.exports = typeormConfig;