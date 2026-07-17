import { db } from './packages/database/src/index.ts';
import { EligibilityService } from './apps/api/src/modules/returns/services/eligibility.service.ts';
async function main() {
  const orderId = 'db9085f2-f1c8-4c13-a3b9-0a243e451674';
  const order = await db.query.orders.findFirst({ where: (o: any, { eq }: any) => eq(o.id, orderId) });
  if (!order) { console.log('Order not found'); Deno.exit(1); }
  try {
    const eligibility = await EligibilityService.checkReturnEligibility(orderId, order.userId);
    console.log('Return:', JSON.stringify(eligibility, null, 2));
  } catch (err: any) { console.error('Error in checkReturnEligibility:', err.message); }
  try {
    const cancellation = await EligibilityService.checkCancellationEligibility(orderId, order.userId);
    console.log('Cancel:', JSON.stringify(cancellation, null, 2));
  } catch (err: any) { console.error('Error in checkCancellationEligibility:', err.message); }
}
main().then(() => Deno.exit(0)).catch(console.error);
