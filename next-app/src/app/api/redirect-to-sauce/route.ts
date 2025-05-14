import { redirect } from 'next/navigation';

// This file serves as an optional redirect handler
// for any path that should automatically go to the sauce app
export function GET(request) {
  return redirect('/sauce');
}
