import { AUTH_ROUTES } from '@/lib/auth';
import { Redirect } from 'expo-router';

export default function SignUpAlias() {
  return <Redirect href={AUTH_ROUTES.signUp} />;
}
