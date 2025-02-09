import { error } from "console";
import { X } from "lucide-react";

type ErrorAleryProps = {
  message: string;
  onClose: () => void;
};

export default function ErrorAlert({ message, onClose }: ErrorAleryProps) {
  const getErrorMessage = (error: unknown): string => {
    if (typeof error === "string") return error;
    if (error instanceof Error) return error.message;
    if (typeof error === "object" && error !== null) {
      const errorObj = error as any;
      return errorObj.response?.data?.detail || errorObj.message || JSON.stringify(error);
    }

    return "An unexpected error occurred";
  };

  const errorMessage = getErrorMessage(message);

  return (
    <div role="alert" className="max-w-md w-full py-2">
      <div className="bg-red-500 text-white font-bold rounded-t px-4 py-2 flex justify-between">
        <span>Danger</span>
        <div onClick={onClose} className="cursor-pointer">
          <X className="w-5 h-5 mt-0.5" />
        </div>
      </div>
      <div className="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
        <p>{errorMessage}</p>
      </div>
    </div>
  );
}
