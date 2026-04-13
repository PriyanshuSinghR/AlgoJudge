// components/common/ActionAlert.jsx
import {
	AlertDialog,
	AlertDialogTrigger,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogCancel,
	AlertDialogAction,
} from "@/components/ui/alert-dialog";

/**
 * ActionAlert
 *
 * Generic confirmation alert for ALL use cases
 */
export function ActionAlert({
	children,
	title = "Are you sure?",
	description,
	confirmText = "Confirm",
	cancelText = "Cancel",
	variant = "default", // default | destructive | primary | warning
	onConfirm,
}) {
	const variantClasses = {
		default: "",
		destructive: "bg-red-600 hover:bg-red-700",
		primary: "bg-indigo-600 hover:bg-indigo-700",
		warning: "bg-orange-600 hover:bg-orange-700",
	};

	return (
		<AlertDialog>
			<AlertDialogTrigger>{children}</AlertDialogTrigger>

			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{title}</AlertDialogTitle>

					{description && (
						<AlertDialogDescription>{description}</AlertDialogDescription>
					)}
				</AlertDialogHeader>

				<AlertDialogFooter>
					<AlertDialogCancel>{cancelText}</AlertDialogCancel>

					<AlertDialogAction
						onClick={onConfirm}
						className={variantClasses[variant]}
					>
						{confirmText}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
