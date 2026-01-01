import { Suspense } from 'react';
import SignInClient from './SignInClient';

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading sign in...
        </div>
      }
    >
      <SignInClient />
    </Suspense>
  );
}
