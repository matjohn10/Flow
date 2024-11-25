import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ReactNode } from "react";

interface props {
  trigger: ReactNode | "string";
  title: string;
  text?: string;
  cancel?: string;
  accept?: string;
  className?: string;
  action: () => void;
}

function Alert({
  trigger,
  title,
  text,
  accept,
  cancel,
  className,
  action,
}: props) {
  return (
    <AlertDialog>
      <AlertDialogTrigger className={className}>{trigger}</AlertDialogTrigger>
      <AlertDialogContent className="bg-dark">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{text}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancel ?? "Cancel"}</AlertDialogCancel>
          <AlertDialogAction onClick={action} className="bg-red">
            {accept ?? "Continue"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default Alert;
