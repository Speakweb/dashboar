import crypto from "crypto";

const algorithm = "aes-192-cbc";
//const iv = crypto.randomBytes(16);//Buffer.from([53,76,25,56,74,36,26,25,37,36,98,43,50,23,54,93]);

const getSecretKey = (pw: string) => {
  const key = crypto.scryptSync(pw, "salt", 24);
  return key;
};

export const encrypt = (pw: string, data: string) => {
  const iv = crypto.randomBytes(16);
  const secretKey = getSecretKey(pw);
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  const encryptedData = cipher.update(data, "utf-8", "hex") + cipher.final("hex");
  return [encryptedData, iv.toString("hex")].join("|");
};

export const decrypt = (pw: string, encryptedData: any) => {
  const [data, iv] = encryptedData.split("|");
  const decipher = crypto.createDecipheriv(algorithm, getSecretKey(pw), Buffer.from(iv, "hex"));
  const decryptedData = decipher.update(data, "hex", "utf-8") + decipher.final();
  return decryptedData;
};
