import JSEncrypt from "jsencrypt";

export default {
    pubilcKey: 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDYfggOPBq643PpqdlsT3t7PNgFy6WXpMUY3rwlvqDrBJwIqE7ACV6JR9qh9y24uFPd8L5d0UNkEVM2eRFHCe38x1XchBRlMgKWGcsSP1sEeJWF61eVDv/c08VC72hGYRwXII3Ufu0nSKfwX6b8u5tjBV7YG9cuCKhrgjr6yK12MQIDAQAB',
    encrypt(plainTextData: string | undefined): string {
        if (plainTextData) {
            const encrypt = new JSEncrypt();
            encrypt.setPublicKey(this.pubilcKey);
            const cipherData = encrypt.encrypt(plainTextData);
            if (cipherData) {
                return cipherData;
            }
        }
        return '';
    },
}