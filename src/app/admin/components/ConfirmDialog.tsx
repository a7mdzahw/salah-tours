import { Toast, toast } from "react-hot-toast";
import Button from "@salah-tours/components/ui/button/Button";

interface ConfirmDialogProps {
  t: Toast;
  title: string;
  message: string;
  onConfirm: () => void;
}

export function ConfirmDialog({ t, title, message, onConfirm }: ConfirmDialogProps) {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 max-w-sm w-full">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 mb-4">{message}</p>
      <div className="flex justify-end gap-3">
        <Button
          color="ghost"
          onClick={() => toast.dismiss(t.id)}
          className="px-4 py-2"
        >
          Cancel
        </Button>
        <Button
          color="primary"
          onClick={() => {
            onConfirm();
            toast.dismiss(t.id);
          }}
          className="px-4 py-2"
        >
          Delete
        </Button>
      </div>
    </div>
  );
} 