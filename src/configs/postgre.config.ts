import * as path from 'node:path';

const POSTGRE_CONFIG = () => ({
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    database: process.env.POSTGRES_DB,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASS,
    entities: [path.join(__dirname, '../entities/**/*.repository{.ts,.js}')],
    synchronize: true,
})

export { POSTGRE_CONFIG };