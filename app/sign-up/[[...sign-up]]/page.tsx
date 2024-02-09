import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="flex justify-center py-40 px-12">
      <SignUp
        path="/sign-up"
        routing="path"
        signInUrl="/sign-in"
        redirectUrl="/new-user"
        afterSignUpUrl="/new-user"
      />
    </div>
  );
}
