import { SignUp } from '@clerk/nextjs';

//sign up page
export default function SignUpPage() {
  return (
    <div className="flex justify-center py-64 px-12 bg-blue-200">
      <SignUp />
    </div>
  );
}
