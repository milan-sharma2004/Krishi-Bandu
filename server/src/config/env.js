const REQUIRED_VARS = ['MONGODB_URI', 'JWT_SECRET'];

export function validateEnv() {
  const missing = REQUIRED_VARS.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }
  if (process.env.JWT_SECRET.length < 16) {
    console.error('JWT_SECRET is too short. Use a long, random string in production.');
    process.exit(1);
  }
}
