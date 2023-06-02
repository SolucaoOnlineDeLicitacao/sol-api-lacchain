import * as CryptoJS from 'crypto-js';

export class SecurityService {

    encrypt(data) {

        const key = process.env.ENCRYPT_KEY;

        const encryptData = CryptoJS.AES.encrypt(
            JSON.stringify(data),
            key,
        );

        return encryptData.toString();
    }

    decypt(data) {
        const bytes = CryptoJS.AES.decrypt(
            data,
            process.env.ENCRYPT_KEY
        );

        if (bytes.toString())
            return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

        return data;
    }
}