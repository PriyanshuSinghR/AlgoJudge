const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;

function hexToBytes(hex) {
	const bytes = new Uint8Array(hex.length / 2);
	for (let i = 0; i < bytes.length; i++) {
		bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
	}
	return bytes;
}

export async function encryptRequest(data) {
	const keyBytes = hexToBytes(SECRET_KEY);

	const cryptoKey = await window.crypto.subtle.importKey(
		"raw",
		keyBytes,
		{ name: "AES-CTR" },
		false,
		["encrypt"],
	);

	const iv = new Uint8Array(16);

	const encoded = new TextEncoder().encode(JSON.stringify(data));

	const encrypted = await window.crypto.subtle.encrypt(
		{
			name: "AES-CTR",
			counter: iv,
			length: 64,
		},
		cryptoKey,
		encoded,
	);

	return btoa(String.fromCharCode(...new Uint8Array(encrypted)));
}
