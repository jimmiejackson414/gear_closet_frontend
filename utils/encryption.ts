import CryptoJS from 'crypto-js';

export const encrypt = (value: any): string => {
  const runtimeConfig = useRuntimeConfig();
  return CryptoJS.AES.encrypt(JSON.stringify(value), runtimeConfig.public.cookieKey)
    .toString();
};

export const decrypt = (value: any): string => {
  if (!value) return '';
  const runtimeConfig = useRuntimeConfig();
  const bytes = CryptoJS.AES.decrypt(value, runtimeConfig.public.cookieKey);
  const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
  return decryptedString ? JSON.parse(decryptedString) : '';
};
