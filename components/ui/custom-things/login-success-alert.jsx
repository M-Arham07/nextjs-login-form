"use client";
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
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'
import {FaCheck} from 'react-icons/fa'

export default function LoginAlert({ isOpen }) {
  const router = useRouter();
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <span className="flex items-center gap-2 text-center">
              <FaCheck className="text-green-500" />
              Login Success
            </span>
          </AlertDialogTitle>
          <AlertDialogDescription>
            You have successfully logged in to your account. You will be redirected to home page in a moment.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
        
          <AlertDialogAction asChild onClick={() => router.replace('/')}> 
            <Button variant="default">OK</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
