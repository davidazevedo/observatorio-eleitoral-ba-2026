import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getPrivateDashboardData } from '@/lib/private-data';
import { PRIVATE_COOKIE_NAME, verifyPrivateSessionToken } from '@/lib/private-auth';
import PrivateDashboardClient from './PrivateDashboardClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function PrivateDashboardPage() {
  const store = await cookies();
  const token = store.get(PRIVATE_COOKIE_NAME)?.value || '';
  if (!verifyPrivateSessionToken(token)) {
    redirect('/privado/login');
  }

  const data = await getPrivateDashboardData();
  return <PrivateDashboardClient data={data} />;
}
