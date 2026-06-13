import { AUTH_ROUTES } from '@/lib/auth';
import { Redirect } from 'expo-router';

export default function SignInAlias() {
  return <Redirect href={AUTH_ROUTES.signIn} />;
}
