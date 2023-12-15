import CryptoJS from 'crypto-js';

export const encrypt = (value: any): string => CryptoJS.AES.encrypt(JSON.stringify(value), import.meta.env.NUXT_COOKIE_KEY as string)
  .toString();

export const decrypt = (value: any): string => {
  const bytes = CryptoJS.AES.decrypt(value, import.meta.env.NUXT_COOKIE_KEY as string);
  return bytes.toString(CryptoJS.enc.Utf8);
};
