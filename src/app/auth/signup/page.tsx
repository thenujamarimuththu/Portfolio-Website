import { Suspense } from 'react';
import SignUpClient from './SignUpClient';

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading sign up...
        </div>
      }
    >
      <SignUpClient />
    </Suspense>
  );
}
