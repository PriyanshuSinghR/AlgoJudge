const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;

function hexToBytes(hex) {
	const bytes = new Uint8Array(hex.length / 2);
	for (let i = 0; i < bytes.length; i++) {
		bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
	}
	return bytes;
}

export async function decryptResponse(payload) {
	const keyBytes = hexToBytes(SECRET_KEY);

	const cryptoKey = await window.crypto.subtle.importKey(
		"raw",
		keyBytes,
		{ name: "AES-CTR" },
		false,
		["decrypt"],
	);

	const iv = new Uint8Array(16);

	const encryptedBytes = Uint8Array.from(atob(payload), (c) => c.charCodeAt(0));

	const decrypted = await window.crypto.subtle.decrypt(
		{
			name: "AES-CTR",
			counter: iv,
			length: 64,
		},
		cryptoKey,
		encryptedBytes,
	);

	const text = new TextDecoder().decode(decrypted);

	return JSON.parse(text);
}
