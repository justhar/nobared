import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { validateRequest } from "@/lib/auth";

export default async function Home() {
  const user = await validateRequest();
  return (
    <main className="flex flex-col items-center justify-center min-h-[calc(100vh-5rem)] text-center px-3">
      <Alert className="sm:hidden mb-8">
        <AlertDescription>
          we recommend you to use a laptop/pc to use this website, because
          haroki cant make mobile ui properly. thank you.
        </AlertDescription>
      </Alert>
      <h1 className="scroll-m-20 text-2xl sm:text-3xl font-bold tracking-tight md:text-5xl text-center">
        nobared, a new way to watch and connect
      </h1>
      <p className="leading-7 [&:not(:first-child)]:mt-4 max-w-screen-md text-sm">
        Join our community of video lovers, and experience the joy of shared
        viewing parties with our app. Watch together, laugh together, and grow
        together with our app.
      </p>
      <div className="flex flex-col md:flex-row justify-center pt-5 gap-7">
        {!user.user ? (
          <Button>
            <Link href="/signin" className="flex">
              <div className="flex text-center">Get Started</div>
            </Link>
          </Button>
        ) : (
          <Link href="/explore" className="text-center flex ">
            <Button variant="ghost">
              <p className="py-2"> Explore some rooms</p>
            </Button>
          </Link>
        )}
      </div>
    </main>
  );
}
