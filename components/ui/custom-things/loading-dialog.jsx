"use client";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function LoadingDialog({ inProgress }) {
  return (
    <AlertDialog open={inProgress}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <span className="flex items-center gap-2">
              <span className="animate-spin inline-block w-6 h-6 border-4 border-blue-400 border-t-transparent rounded-full mr-2"></span>
              Loading...
            </span>
          </AlertDialogTitle>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}
