import { LoginForm2 } from "./components/login-form-2"
 import Link from "next/link"
import Image from "next/image"

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <div className="  flex   items-center justify-center rounded-md">
               <Image 
                                    src="https://xqqbnlsmqrgwgscuigwi.supabase.co/storage/v1/object/sign/platform%20images/Logo.avif?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9kMmM4MjVjNi1lN2E0LTQ3NTktYTU3ZS1lMTgzZGZmMWRlNjQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwbGF0Zm9ybSBpbWFnZXMvTG9nby5hdmlmIiwiaWF0IjoxNzY3NjYxOTY1LCJleHAiOjIwODMwMjE5NjV9.jUvcTAjonyLEPTrf8-QNfVxeNOLeHHw3CNjieuyrU7o"
                                     alt="TCTPro Logo"
                                     width={75}
                                     height={75}
                                    />
            </div> 
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">
            <LoginForm2 />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <Image
          src="https://xqqbnlsmqrgwgscuigwi.supabase.co/storage/v1/object/sign/platform%20images/bg2.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9kMmM4MjVjNi1lN2E0LTQ3NTktYTU3ZS1lMTgzZGZmMWRlNjQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwbGF0Zm9ybSBpbWFnZXMvYmcyLmpwZyIsImlhdCI6MTc2NzY2MjU1MSwiZXhwIjoyMDgzMDIyNTUxfQ.O8g3N2NpmeT8D5WKdWVbCuP4nmyiJNa5p2YYxzLjnzA"
          alt="Image"
          fill
          className="object-cover dark:brightness-[0.95]  "
        />
      </div>
    </div>
  )
}
