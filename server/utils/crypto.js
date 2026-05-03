import crypto from "crypto";

// ⚠️ use hex encoding
const SECRET_KEY = Buffer.from(process.env.SECRET_KEY, "hex");
const IV = Buffer.alloc(16, 0);

export function encryptResponse(data) {
	const cipher = crypto.createCipheriv("aes-256-ctr", SECRET_KEY, IV);

	const json = JSON.stringify(data);

	const encrypted = Buffer.concat([cipher.update(json), cipher.final()]);

	return encrypted.toString("base64");
}

export function decryptRequest(payload) {
	const encryptedBuffer = Buffer.from(payload, "base64");

	const decipher = crypto.createDecipheriv("aes-256-ctr", SECRET_KEY, IV);

	const decrypted = Buffer.concat([
		decipher.update(encryptedBuffer),
		decipher.final(),
	]);

	const text = decrypted.toString("utf-8");

	return JSON.parse(text);
}
