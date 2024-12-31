import { Input } from "@/components/ui/input";
import { ComponentPropsWithRef } from "react";

type InputProps = ComponentPropsWithRef<typeof Input>;

export default function EnhancedInput(props: InputProps) {
  return (
    <Input
      {...props}
      className={`dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-400 dark:border-slate-300 ${
        props.className || ""
      }`}
    />
  );
}
