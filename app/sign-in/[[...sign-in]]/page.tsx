import { SignIn } from '@clerk/nextjs';

export default function Page() {
  return (
    <div className="flex justify-center py-64 px-12 bg-blue-200">
      <SignIn afterSignUpUrl="/new-user" />
    </div>
  );
}
