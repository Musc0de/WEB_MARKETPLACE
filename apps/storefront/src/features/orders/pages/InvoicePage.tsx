import { Link, useParams } from 'react-router-dom';
import useSWR from 'swr';
import { ChevronLeft, Download, Printer } from 'lucide-react';
import { client } from '../../../lib/api.ts';
import { InvoiceData } from '../types/invoice.ts';
import { formatCurrency, formatDate } from '../utils/formatters.ts';

const fetchInvoiceData = async (orderId: string): Promise<InvoiceData> => {
  const res = await client.v1.orders[':id']['invoice-data'].$get({ param: { id: orderId } });
  if (!res.ok) throw new Error('Failed to fetch invoice data');
  const json = await res.json();
  return json.data as InvoiceData;
};

const StatusBadge = (
  { status, type }: { status: string; type: 'payment' | 'shipping' | 'invoice' },
) => {
  let colorClass = 'bg-gray-100 text-gray-800';
  const label = status.toUpperCase();

  if (type === 'payment' || type === 'invoice') {
    switch (status.toLowerCase()) {
      case 'paid':
        colorClass = 'bg-green-100 text-green-800 border-green-200';
        break;
      case 'pending':
      case 'unpaid':
        colorClass = 'bg-yellow-100 text-yellow-800 border-yellow-200';
        break;
      case 'failed':
        colorClass = 'bg-red-100 text-red-800 border-red-200';
        break;
      case 'refunded':
        colorClass = 'bg-blue-100 text-blue-800 border-blue-200';
        break;
      case 'cancelled':
      case 'void':
        colorClass = 'bg-gray-100 text-gray-800 border-gray-200';
        break;
    }
  } else if (type === 'shipping') {
    switch (status.toLowerCase()) {
      case 'delivered':
        colorClass = 'bg-green-100 text-green-800 border-green-200';
        break;
      case 'processing':
      case 'packed':
      case 'shipped':
      case 'in transit':
        colorClass = 'bg-blue-100 text-blue-800 border-blue-200';
        break;
      case 'pending':
        colorClass = 'bg-yellow-100 text-yellow-800 border-yellow-200';
        break;
      case 'returned':
      case 'cancelled':
        colorClass = 'bg-red-100 text-red-800 border-red-200';
        break;
    }
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colorClass}`}
    >
      {label}
    </span>
  );
};

export const InvoicePage = () => {
  const { id } = useParams<{ id: string }>();
  const { data, error, isLoading } = useSWR(
    id ? ['invoice-data', id] : null,
    () => fetchInvoiceData(id!),
  );

  if (isLoading) {
    return <div className='min-h-screen flex items-center justify-center'>Memuat invoice...</div>;
  }

  if (error || !data) {
    return (
      <div className='min-h-screen flex flex-col items-center justify-center'>
        <h2 className='text-xl font-bold text-red-600 mb-2'>Gagal memuat invoice</h2>
        <p className='text-gray-600 mb-4'>{error?.message || 'Data tidak ditemukan'}</p>
        <Link to='/' className='text-blue-600 hover:underline'>Kembali ke Beranda</Link>
      </div>
    );
  }

  const invoiceNumber = data.invoice?.invoiceNumber || `INV-${data.order.orderNumber}`;
  const invoiceDate = data.invoice?.issuedAt || data.order.createdAt;

  return (
    <div className='bg-gray-50 min-h-screen py-8 print:py-0 print:bg-white'>
      <div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* ACTION BUTTONS - HIDDEN ON PRINT */}
        <div className='mb-6 flex flex-col sm:flex-row justify-between items-center gap-4 print:hidden'>
          <Link
            to={`/orders/${id}`}
            className='inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900'
          >
            <ChevronLeft className='w-4 h-4 mr-1' />
            Back to Order
          </Link>
          <div className='flex gap-3'>
            <button
              type='button'
              onClick={() => globalThis.print()}
              className='inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none'
            >
              <Printer className='w-4 h-4 mr-2' />
              Print Invoice
            </button>
            <button
              type='button'
              onClick={() => globalThis.print()} // Acts as Save to PDF if system dialog is used
              className='inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none'
            >
              <Download className='w-4 h-4 mr-2' />
              Download PDF
            </button>
          </div>
        </div>

        {/* INVOICE PAPER */}
        <div className='bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200 print:shadow-none print:border-none print:m-0 print:p-0'>
          {/* HEADER */}
          <div className='p-8 sm:p-10 border-b border-gray-200 bg-blue-50/50 print:bg-transparent'>
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-6'>
              <div>
                <h1 className='text-3xl font-extrabold text-blue-900 tracking-tight mb-1'>
                  INVOICE
                </h1>
                <p className='text-sm font-medium text-gray-500'>StarSuperScare Marketplace</p>
              </div>
              <div className='text-left md:text-right'>
                <div className='flex items-center md:justify-end gap-2 mb-2'>
                  <span className='text-sm text-gray-500'>Status:</span>
                  <StatusBadge status={data.invoice?.status || 'UNPAID'} type='invoice' />
                </div>
                <p className='text-sm text-gray-600 mb-1'>
                  <span className='font-semibold text-gray-900'>Invoice No:</span> {invoiceNumber}
                </p>
                <p className='text-sm text-gray-600 mb-1'>
                  <span className='font-semibold text-gray-900'>Order ID:</span>{' '}
                  {data.order.orderNumber}
                </p>
                <p className='text-sm text-gray-600 mb-1'>
                  <span className='font-semibold text-gray-900'>Invoice Date:</span>{' '}
                  {formatDate(invoiceDate)}
                </p>
                {data.invoice?.dueDate && (
                  <p className='text-sm text-gray-600'>
                    <span className='font-semibold text-gray-900'>Due Date:</span>{' '}
                    {formatDate(data.invoice.dueDate)}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ADDRESSES */}
          <div className='p-8 sm:p-10 grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-gray-100'>
            <div>
              <h2 className='text-xs font-bold text-gray-400 uppercase tracking-wider mb-4'>
                Bill To
              </h2>
              <p className='font-semibold text-gray-900 mb-1'>
                {data.addresses?.billingSnapshot?.name || data.customer.name || 'Customer'}
              </p>
              <p className='text-sm text-gray-600 mb-1'>{data.customer.email}</p>
              {data.addresses?.billingSnapshot?.phone && (
                <p className='text-sm text-gray-600 mb-2'>{data.addresses.billingSnapshot.phone}</p>
              )}

              {data.addresses?.billingSnapshot
                ? (
                  <div className='text-sm text-gray-600 leading-relaxed'>
                    {data.addresses.billingSnapshot.addressLine1 && (
                      <p>{data.addresses.billingSnapshot.addressLine1}</p>
                    )}
                    {data.addresses.billingSnapshot.addressLine2 && (
                      <p>{data.addresses.billingSnapshot.addressLine2}</p>
                    )}
                    <p>
                      {[
                        data.addresses.billingSnapshot.subdistrict,
                        data.addresses.billingSnapshot.district,
                        data.addresses.billingSnapshot.city,
                      ].filter(Boolean).join(', ')}
                    </p>
                    <p>
                      {[
                        data.addresses.billingSnapshot.province,
                        data.addresses.billingSnapshot.postalCode,
                        data.addresses.billingSnapshot.country,
                      ].filter(Boolean).join(' ')}
                    </p>
                  </div>
                )
                : <p className='text-sm text-gray-400 italic'>Alamat penagihan belum tersedia</p>}
            </div>

            <div>
              <h2 className='text-xs font-bold text-gray-400 uppercase tracking-wider mb-4'>
                Ship To
              </h2>
              {data.addresses?.shippingSnapshot
                ? (
                  <>
                    <p className='font-semibold text-gray-900 mb-1'>
                      {data.addresses.shippingSnapshot.name || 'Penerima'}
                    </p>
                    {data.addresses.shippingSnapshot.phone && (
                      <p className='text-sm text-gray-600 mb-2'>
                        {data.addresses.shippingSnapshot.phone}
                      </p>
                    )}
                    <div className='text-sm text-gray-600 leading-relaxed'>
                      {data.addresses.shippingSnapshot.addressLine1 && (
                        <p>{data.addresses.shippingSnapshot.addressLine1}</p>
                      )}
                      {data.addresses.shippingSnapshot.addressLine2 && (
                        <p>{data.addresses.shippingSnapshot.addressLine2}</p>
                      )}
                      <p>
                        {[
                          data.addresses.shippingSnapshot.subdistrict,
                          data.addresses.shippingSnapshot.district,
                          data.addresses.shippingSnapshot.city,
                        ].filter(Boolean).join(', ')}
                      </p>
                      <p>
                        {[
                          data.addresses.shippingSnapshot.province,
                          data.addresses.shippingSnapshot.postalCode,
                          data.addresses.shippingSnapshot.country,
                        ].filter(Boolean).join(' ')}
                      </p>
                      {data.addresses.shippingSnapshot.notes && (
                        <p className='mt-2 text-gray-500 italic'>
                          Catatan: {data.addresses.shippingSnapshot.notes}
                        </p>
                      )}
                    </div>
                  </>
                )
                : <p className='text-sm text-gray-400 italic'>Alamat pengiriman belum tersedia</p>}
            </div>
          </div>

          {/* INFO PANELS (PAYMENT & SHIPPING) */}
          <div className='p-8 sm:p-10 grid grid-cols-1 sm:grid-cols-2 gap-8 border-b border-gray-100 bg-gray-50/30 print:bg-transparent'>
            <div>
              <h2 className='text-xs font-bold text-gray-400 uppercase tracking-wider mb-4'>
                Payment Information
              </h2>
              {data.payment
                ? (
                  <div className='space-y-2'>
                    <div className='flex justify-between items-center text-sm'>
                      <span className='text-gray-500'>Method</span>
                      <span className='font-medium text-gray-900'>{data.payment.provider}</span>
                    </div>
                    <div className='flex justify-between items-center text-sm'>
                      <span className='text-gray-500'>Status</span>
                      <StatusBadge status={data.payment.status} type='payment' />
                    </div>
                    {data.payment.providerTransactionId && (
                      <div className='flex justify-between items-center text-sm'>
                        <span className='text-gray-500'>Transaction ID</span>
                        <span className='text-gray-900 font-mono text-xs'>
                          {data.payment.providerTransactionId}
                        </span>
                      </div>
                    )}
                    <div className='flex justify-between items-center text-sm'>
                      <span className='text-gray-500'>Date</span>
                      <span className='text-gray-900'>
                        {formatDate(data.payment.createdAt, true)}
                      </span>
                    </div>
                  </div>
                )
                : <p className='text-sm text-gray-400 italic'>Belum tersedia</p>}
            </div>

            <div>
              <h2 className='text-xs font-bold text-gray-400 uppercase tracking-wider mb-4'>
                Shipping Information
              </h2>
              {data.shipment
                ? (
                  <div className='space-y-2'>
                    <div className='flex justify-between items-center text-sm'>
                      <span className='text-gray-500'>Courier</span>
                      <span className='font-medium text-gray-900'>{data.shipment.carrier}</span>
                    </div>
                    <div className='flex justify-between items-center text-sm'>
                      <span className='text-gray-500'>Status</span>
                      <StatusBadge status={data.shipment.status} type='shipping' />
                    </div>
                    <div className='flex justify-between items-center text-sm'>
                      <span className='text-gray-500'>Tracking</span>
                      {data.shipment.trackingNumber
                        ? (
                          <span className='text-gray-900 font-mono text-xs cursor-all-scroll'>
                            {data.shipment.trackingNumber}
                          </span>
                        )
                        : <span className='text-gray-400 italic text-xs'>Belum tersedia</span>}
                    </div>
                    {data.shipment.shippedAt && (
                      <div className='flex justify-between items-center text-sm'>
                        <span className='text-gray-500'>Shipped</span>
                        <span className='text-gray-900'>{formatDate(data.shipment.shippedAt)}</span>
                      </div>
                    )}
                  </div>
                )
                : <p className='text-sm text-gray-400 italic'>Belum tersedia</p>}
            </div>
          </div>

          {/* ITEMS TABLE */}
          <div className='p-8 sm:p-10 border-b border-gray-100 print:break-inside-avoid'>
            <h2 className='text-xs font-bold text-gray-400 uppercase tracking-wider mb-4'>
              Order Items
            </h2>
            <div className='overflow-x-auto'>
              <table className='w-full text-left border-collapse'>
                <thead>
                  <tr className='border-b-2 border-gray-200'>
                    <th className='py-3 px-2 text-sm font-semibold text-gray-900'>Item</th>
                    <th className='py-3 px-2 text-sm font-semibold text-gray-900 text-center'>
                      Qty
                    </th>
                    <th className='py-3 px-2 text-sm font-semibold text-gray-900 text-right'>
                      Price
                    </th>
                    <th className='py-3 px-2 text-sm font-semibold text-gray-900 text-right'>
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-100'>
                  {data.items.map((item, index) => (
                    <tr key={item.id || index} className='print:break-inside-avoid'>
                      <td className='py-4 px-2'>
                        <div className='flex items-center'>
                          {item.thumbnailUrl && (
                            <img
                              src={item.thumbnailUrl}
                              alt={item.productNameSnapshot}
                              className='w-12 h-12 object-cover rounded mr-4 bg-gray-100 border border-gray-200 print:hidden'
                            />
                          )}
                          <div>
                            <p className='text-sm font-medium text-gray-900'>
                              {item.productNameSnapshot}
                            </p>
                            <p className='text-xs text-gray-500 mt-0.5'>
                              SKU: {item.variantSkuSnapshot}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className='py-4 px-2 text-sm text-gray-900 text-center'>
                        {item.quantity}
                      </td>
                      <td className='py-4 px-2 text-sm text-gray-900 text-right whitespace-nowrap'>
                        {formatCurrency(item.priceSnapshot)}
                      </td>
                      <td className='py-4 px-2 text-sm font-medium text-gray-900 text-right whitespace-nowrap'>
                        {formatCurrency(item.priceSnapshot * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SUMMARY */}
          <div className='p-8 sm:p-10 flex flex-col md:flex-row justify-end print:break-inside-avoid'>
            <div className='w-full md:w-1/2 lg:w-1/3 space-y-3'>
              <div className='flex justify-between text-sm text-gray-600'>
                <span>Subtotal</span>
                <span>{formatCurrency(data.order.subtotalAmount)}</span>
              </div>
              <div className='flex justify-between text-sm text-gray-600'>
                <span>Shipping Fee</span>
                <span>{formatCurrency(data.order.shippingAmount)}</span>
              </div>
              <div className='flex justify-between text-sm text-gray-600'>
                <span>Tax</span>
                <span>{formatCurrency(data.order.taxAmount)}</span>
              </div>
              <div className='border-t border-gray-200 pt-3 mt-3 flex justify-between items-center'>
                <span className='text-base font-bold text-gray-900'>Grand Total</span>
                <span className='text-xl font-extrabold text-blue-700'>
                  {formatCurrency(data.order.totalAmount)}
                </span>
              </div>
              {data.payment?.status === 'paid' && (
                <div className='flex justify-between items-center mt-2 text-sm'>
                  <span className='font-semibold text-green-700'>Amount Paid</span>
                  <span className='font-semibold text-green-700'>
                    {formatCurrency(data.payment.amount)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* FOOTER */}
          <div className='bg-gray-50 p-6 sm:px-10 text-center print:bg-transparent print:border-t print:border-gray-200'>
            <p className='text-sm font-medium text-gray-900 mb-1'>
              Terima kasih telah berbelanja di StarSuperScare Marketplace.
            </p>
            <p className='text-xs text-gray-500 mb-3'>
              Jika Anda memiliki pertanyaan mengenai invoice ini, silakan hubungi
              support@starsuperscare.com
            </p>
            <p className='text-xs text-gray-400 italic'>
              This invoice was generated automatically by StarSuperScare Marketplace system.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
