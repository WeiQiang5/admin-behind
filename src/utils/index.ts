import * as bcrypt from 'bcrypt';
// 分页
export function getPageOffset(page = 1, limit = 10) {
  return (page - 1) * limit;
}

//删除指定键
export function deleteKey(obj: Record<string, any>, keys: string) {
  if (typeof obj === 'object') {
    if (Reflect.has(obj, keys)) {
      Reflect.deleteProperty(obj, keys);
    }
  }
}

// 加密
export async function encryption(
  password: string,
  saltOrRounds = 10,
): Promise<string> {
  const salt = await bcrypt.genSalt(saltOrRounds);
  const hash = await bcrypt.hash(password, salt);
  return hash;
}
// 比较
export async function compareCryption(
  inputPassword: string,
  storagePassword: string,
): Promise<boolean> {
  return await bcrypt.compare(inputPassword, storagePassword);
}
