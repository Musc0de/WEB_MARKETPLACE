export type ReturnStatus =
  | 'requested'
  | 'under_review'
  | 'awaiting_evidence'
  | 'approved'
  | 'rejected'
  | 'awaiting_return_shipment'
  | 'return_shipped'
  | 'return_received'
  | 'inspection'
  | 'refund_processing'
  | 'replacement_processing'
  | 'resolved'
  | 'closed'
  | 'escalated'
  | 'cancelled';

export class StatusMachineService {
  private static allowedTransitions: Record<ReturnStatus, ReturnStatus[]> = {
    'requested': ['under_review', 'cancelled', 'rejected', 'approved'],
    'under_review': ['awaiting_evidence', 'approved', 'rejected', 'escalated'],
    'awaiting_evidence': ['under_review', 'rejected', 'cancelled'],
    'approved': ['awaiting_return_shipment', 'refund_processing', 'replacement_processing'],
    'awaiting_return_shipment': ['return_shipped', 'cancelled'],
    'return_shipped': ['return_received'],
    'return_received': ['inspection'],
    'inspection': ['refund_processing', 'replacement_processing', 'rejected'],
    'refund_processing': ['resolved'],
    'replacement_processing': ['resolved'],
    'resolved': ['closed', 'escalated'],
    'rejected': ['escalated'],
    'escalated': ['resolved', 'closed'],
    'cancelled': [],
    'closed': [],
  };

  static isValidTransition(current: ReturnStatus, next: ReturnStatus): boolean {
    const allowed = this.allowedTransitions[current];
    if (!allowed) return false;
    return allowed.includes(next);
  }

  static assertValidTransition(current: ReturnStatus, next: ReturnStatus) {
    if (!this.isValidTransition(current, next)) {
      throw new Error(`Invalid status transition from ${current} to ${next}`);
    }
  }
}
