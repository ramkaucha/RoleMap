import { X } from "lucide-react";

type ErrorAleryProps = {
  message: string;
  onClose: () => void;
};

export default function ErrorAlert({ message, onClose }: ErrorAleryProps) {
  return (
    <div role="alert" className="max-w-md w-full py-2">
      <div className="bg-red-500 text-white font-bold rounded-t px-4 py-2 flex justify-between">
        <span>Danger</span>
        <div onClick={onClose}>
          <X className="w-5 h-5 mt-0.5" />
        </div>
      </div>
      <div className="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
        <p>{message}</p>
      </div>
    </div>
  );
}
