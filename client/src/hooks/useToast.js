import { toast as sonnerToast } from "sonner";

export function useToast() {
	const show = (message, options = {}) => {
		if (typeof message === "string") {
			sonnerToast(message, options);
		} else {
			sonnerToast(message.title, {
				description: message.description,
				...options,
			});
		}
	};

	const success = (title, description, options = {}) => {
		sonnerToast.success(title, {
			description,
			duration: 4000,
			...options,
		});
	};

	const error = (title, description, options = {}) => {
		sonnerToast.error(title, {
			description,
			duration: 5000,
			...options,
		});
	};

	const info = (title, description, options = {}) => {
		sonnerToast(title, {
			description,
			duration: 4000,
			...options,
		});
	};

	const warning = (title, description, options = {}) => {
		sonnerToast.warning?.(title, {
			description,
			duration: 4500,
			...options,
		}) ||
			sonnerToast(title, {
				description,
				duration: 4500,
				style: { background: "#facc15", color: "#000" },
				...options,
			});
	};

	const dismiss = (id) => sonnerToast.dismiss(id);

	const clearAll = () => sonnerToast.dismiss();

	return { show, success, error, info, warning, dismiss, clearAll };
}
