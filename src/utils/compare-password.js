import bcrypt from 'bcrypt';

export async function comparePassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}