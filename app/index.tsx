import { Redirect } from 'expo-router';
import { useAuthStore } from '@/store/useAuthStore';

export default function Index() {
  const { isFirstLaunch, masterPin } = useAuthStore();

  if (isFirstLaunch || !masterPin) {
    return <Redirect href="/onboarding/welcome" />;
  }

  return <Redirect href="/lock-screen" />;
}
