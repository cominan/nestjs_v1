import * as bcrypt from 'bcryptjs';

export async function hashPass(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePass(plainPassword: string, hashedPassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (error) {
    console.error('Lỗi khi so sánh mật khẩu:', error);
    return false;
  }
}

export async function verifyToken(token: string): Promise<any> {
  const jwt = require('jsonwebtoken');
  try {
    const decoded = jwt.verify(token, 'secret');
    return decoded;
  } catch (error) {
    console.error('Lỗi khi xây dung token:', error);
    return false;
  }
}