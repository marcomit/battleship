const forge = require("node-forge");

export function generateAsyncKey(): Promise<Keys> {
  return new Promise((resolve, reject) => {
    forge.pki.rsa.generateKeyPair(
      { bits: 2048, workers: -1 },
      (err: any, keypair: any) => {
        if (err) {
          console.error("Errore nella generazione delle chiavi:", err);
          reject(err);
        } else {
          const privateKeyPem = forge.pki.privateKeyToPem(keypair.privateKey);
          const publicKeyPem = forge.pki.publicKeyToPem(keypair.publicKey);
          resolve({ privateKey: privateKeyPem, publicKey: publicKeyPem });
        }
      }
    );
  });
}
export function encryptMessage(message: string, publicKeyPem: string) {
  const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
  const encrypted = publicKey.encrypt(forge.util.encodeUtf8(message));
  return forge.util.encode64(encrypted);
}
export function decryptMessage(
  encryptedMessage: string,
  privateKeyPem: string
): string {
  const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
  const encryptedBytes = forge.util.decode64(encryptedMessage);
  const decrypted = privateKey.decrypt(encryptedBytes);
  return forge.util.decodeUtf8(decrypted);
}
