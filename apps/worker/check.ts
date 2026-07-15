import { db, outboxEvents, users } from '@starsuperscare/database';
import { eq } from 'drizzle-orm';

async function main() {
  const email = 'whenjpsir827@gmail.com';
  const user = await db.query.users.findFirst({
    where: eq(users.emailNormalized, email),
  });
  console.log('User status:', user?.status, 'ID:', user?.id);

  if (user) {
    const events = await db.query.outboxEvents.findMany({
      where: eq(outboxEvents.type, 'password_reset_requested'),
    });
    const userEvents = events.filter((e) => (e.payload as any)?.email === email);
    console.log(`Password Reset Events for ${email}:`, userEvents);
  }
  Deno.exit(0);
}

main();
