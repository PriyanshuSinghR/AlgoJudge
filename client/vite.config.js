import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import MonacoEditorPlugin from "vite-plugin-monaco-editor";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss(), MonacoEditorPlugin()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
});
