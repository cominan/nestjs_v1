import * as bcrypt from 'bcryptjs';

export const hashPassword = async (password: string) => {
  try {
    return await bcrypt.hash(password, 12);
  } catch (error) {
    console.log(error);
  }
};

export const comparePassword = async (password: string, hash: string) => {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    console.log(error);
  }
};
