import 'dotenv/config';
/**
 * @type {import('drizzle-kit').Config}
 * See https://drizzle-orm.com/docs/config for more info
 */

export default {
  schema: './src/models/*.js',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
};
