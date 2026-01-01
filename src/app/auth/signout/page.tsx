import { Suspense } from 'react';
import SignOutClient from './SignOutClient';

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Signing out...
        </div>
      }
    >
      <SignOutClient />
    </Suspense>
  );
}
