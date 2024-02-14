import { SignUp } from '@clerk/nextjs';

//sign up page
export default function SignUpPage() {
  return (
    <div className="flex justify-center py-40 px-12">
      <SignUp  />
    </div>
  );
}
