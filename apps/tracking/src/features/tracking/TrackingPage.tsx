import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  H3,
  Small,
  Text,
} from '@starsuperscare/ui';
import {
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  MapPin,
  Package,
  PackageX,
  Truck,
} from 'lucide-react';

const getCourierLogoUrl = (courierName: string) => {
  const name = courierName.toLowerCase();
  let domain = '';
  if (name.includes('jne')) domain = 'jne.co.id';
  else if (name.includes('j&t') || name.includes('jnt')) domain = 'jet.co.id';
  else if (name.includes('id express')) domain = 'idexpress.com';
  else if (name.includes('pos')) domain = 'posindonesia.co.id';
  else if (name.includes('ninja')) domain = 'ninjaxpress.co';
  else if (name.includes('anteraja')) domain = 'anteraja.id';
  else if (name.includes('lion')) domain = 'lionparcel.com';
  else if (name.includes('paxel')) domain = 'paxel.co';
  else if (name.includes('sap')) domain = 'sap-express.id';
  else if (name.includes('lazada') || name.includes('lex')) domain = 'lazada.co.id';
  else if (name.includes('jdl') || name.includes('jx')) domain = 'j-express.id';
  else if (name.includes('kerry')) domain = 'kerryexpress.com';
  else if (name.includes('sf express')) domain = 'sf-express.com';

  if (domain) {
    const logoServiceUrl = (import.meta as any).env?.VITE_LOGO_SERVICE_URL;
    if (logoServiceUrl) {
      return `${logoServiceUrl}${domain}&sz=64`;
    }
  }
  return null;
};

const CourierLogo = ({ courier }: { courier: string }) => {
  const url = getCourierLogoUrl(courier);
  const [error, setError] = useState(false);

  if (!url || error) {
    return (
      <div className='w-8 h-8 bg-gray-100 rounded flex items-center justify-center text-gray-500'>
        <Truck size={16} />
      </div>
    );
  }

  return (
    <img
      src={url}
      alt={courier}
      className='h-8 w-auto max-w-[80px] object-contain rounded-sm bg-white p-0.5'
      onError={() => setError(true)}
    />
  );
};

export function TrackingPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  // Split tokens for bulk tracking (max 10)
  const tokens = token ? token.split(',').map((t) => t.trim()).filter(Boolean).slice(0, 10) : [];

  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openPanels, setOpenPanels] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function fetchTracking() {
      try {
        const apiUrl = (import.meta as any).env?.VITE_API_URL;
        if (!apiUrl) throw new Error('VITE_API_URL is missing');

        const fetchedResults = await Promise.all(tokens.map(async (t) => {
          const res = await fetch(`${apiUrl}/v1/tracking/${t}`);
          if (!res.ok) {
            return {
              token: t,
              error: res.status === 404
                ? 'Informasi Pelacakan Tidak Tersedia'
                : 'Gagal memuat status',
            };
          }
          const json = await res.json();
          return { token: t, data: json.data };
        }));

        setResults(fetchedResults);

        // Open the first valid result by default
        if (fetchedResults.length > 0) {
          setOpenPanels({ [fetchedResults[0].token]: true });
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (tokens.length > 0) fetchTracking();
  }, [token]);

  const togglePanel = (t: string) => {
    setOpenPanels((prev) => ({ ...prev, [t]: !prev[t] }));
  };

  if (loading) {
    return (
      <div className='max-w-3xl mx-auto px-4 py-12 flex flex-col items-center'>
        <div className='w-12 h-12 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin mb-4' />
        <p className='text-gray-500'>Memuat data pelacakan...</p>
      </div>
    );
  }

  if (error || results.length === 0) {
    return (
      <div className='max-w-3xl mx-auto px-4 py-12 animate-in fade-in duration-500'>
        <button
          type='button'
          onClick={() => navigate(-1)}
          className='flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 mb-6 font-bold transition-colors'
        >
          <ChevronLeft size={20} className='mr-1' /> Kembali
        </button>
        <div className='bg-card rounded-3xl shadow-sm border border-border/60 p-8 text-center'>
          <div className='w-20 h-20 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto mb-6'>
            <PackageX size={40} />
          </div>
          <h2 className='text-2xl font-black text-foreground mb-3 tracking-tight'>
            {error || 'Paket tidak ditemukan'}
          </h2>
          <p className='text-muted-foreground font-medium'>
            Silakan periksa kembali Nomor Resi atau Tautan Anda.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='max-w-3xl mx-auto px-4 py-8 md:py-12 space-y-8 animate-in fade-in duration-500'>
      <div className='flex items-center gap-4 pb-2'>
        <button
          type='button'
          onClick={() => navigate(-1)}
          className='flex items-center text-indigo-600 dark:text-indigo-400 font-bold transition-colors border border-indigo-500/20 bg-indigo-500/10 hover:bg-indigo-500/20 px-4 py-2 rounded-xl active:scale-95'
        >
          <ChevronLeft size={18} className='mr-1' /> Kembali
        </button>
      </div>

      <div className='flex items-center gap-5 border-b border-border/60 pb-8'>
        <div className='p-4 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-2xl'>
          <Truck size={32} />
        </div>
        <div>
          <H3 className='!mt-0 tracking-tight'>Pelacakan Paket</H3>
          <p className='text-muted-foreground font-medium'>
            {results.length > 1
              ? `Menampilkan ${results.length} resi secara bulk`
              : 'Detail pengiriman Anda'}
          </p>
        </div>
      </div>

      <div className='space-y-6'>
        {results.map((result) => {
          const isOpen = openPanels[result.token];
          const hasError = !!result.error;
          const data = result.data;

          return (
            <Card
              key={result.token}
              className={`shadow-sm border-border/60 overflow-hidden transition-all duration-300 rounded-3xl ${
                isOpen ? 'ring-2 ring-indigo-500/50' : 'hover:border-indigo-500/30 hover:shadow-md'
              }`}
            >
              <div
                className='p-5 md:p-6 flex items-center justify-between cursor-pointer bg-card hover:bg-muted/30 transition-colors select-none group'
                onClick={() => togglePanel(result.token)}
              >
                <div className='flex items-center gap-4'>
                  <div
                    className={`p-3 rounded-2xl ${
                      hasError
                        ? 'bg-destructive/10 text-destructive'
                        : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                    }`}
                  >
                    {hasError ? <PackageX size={24} /> : <Package size={24} />}
                  </div>
                  <div>
                    <div className='font-black text-lg text-foreground tracking-tight'>
                      {result.token}
                    </div>
                    <div className='text-sm font-medium text-muted-foreground'>
                      {hasError
                        ? 'Gagal dilacak'
                        : (data?.shipment?.courier || 'Informasi kurir tidak tersedia')}
                    </div>
                  </div>
                </div>
                <div className='flex items-center gap-4'>
                  {!hasError && data?.shipment?.status && (
                    <Badge
                      variant='outline'
                      className='bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 hidden sm:inline-flex font-bold px-3 py-1 rounded-lg'
                    >
                      {data.shipment.status.toUpperCase().replace(/_/g, ' ')}
                    </Badge>
                  )}
                  <div
                    className={`p-2 rounded-xl group-hover:bg-muted/50 transition-colors ${
                      isOpen ? 'bg-muted' : ''
                    }`}
                  >
                    <ChevronDown
                      size={24}
                      className={`text-muted-foreground transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </div>
              </div>

              {isOpen && (
                <div className='border-t border-border/60 animate-in slide-in-from-top-4 fade-in duration-300'>
                  {hasError
                    ? (
                      <div className='p-10 text-center text-muted-foreground bg-muted/20 font-medium'>
                        <PackageX size={32} className='mx-auto mb-3 opacity-50' />
                        {result.error}
                      </div>
                    )
                    : (
                      <>
                        <CardContent className='space-y-5 pt-8 px-6'>
                          <div className='flex items-center justify-between border-b border-border/60 pb-5'>
                            <Small className='text-muted-foreground font-bold uppercase tracking-wider'>
                              Status Pesanan
                            </Small>
                            <Badge
                              variant='outline'
                              className='bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20 font-bold px-3 py-1 rounded-lg'
                            >
                              {data.orderStatus.toUpperCase().replace(/_/g, ' ')}
                            </Badge>
                          </div>

                          {data.shipment
                            ? (
                              <>
                                <div className='flex items-center justify-between border-b border-border/60 pb-5'>
                                  <Small className='text-muted-foreground font-bold uppercase tracking-wider'>
                                    Kurir
                                  </Small>
                                  <div className='flex items-center gap-3'>
                                    <CourierLogo courier={data.shipment.courier} />
                                    <Text className='font-semibold !mt-0'>
                                      {data.shipment.courier}
                                    </Text>
                                  </div>
                                </div>

                                <div className='flex justify-between border-b border-border/60 pb-5'>
                                  <Small className='text-muted-foreground font-bold uppercase tracking-wider'>
                                    Nomor Resi
                                  </Small>
                                  <Text className='font-mono bg-muted px-3 py-1.5 rounded-lg text-sm font-bold text-foreground border border-border/60'>
                                    {data.shipment.trackingNumber}
                                  </Text>
                                </div>

                                <div className='flex justify-between pb-3'>
                                  <Small className='text-muted-foreground font-bold uppercase tracking-wider'>
                                    Estimasi Tiba
                                  </Small>
                                  <Text className='!mt-0 font-black text-foreground'>
                                    {data.shipment.estimatedDeliveryAt
                                      ? new Date(data.shipment.estimatedDeliveryAt)
                                        .toLocaleDateString('id-ID', {
                                          weekday: 'long',
                                          year: 'numeric',
                                          month: 'long',
                                          day: 'numeric',
                                        })
                                      : 'Menunggu penjemputan'}
                                  </Text>
                                </div>
                              </>
                            )
                            : (
                              <div className='py-6 text-center text-muted-foreground font-medium'>
                                Belum ada informasi pengiriman untuk pesanan ini.
                              </div>
                            )}
                        </CardContent>

                        {data.shipment && data.shipment.events.length > 0 && (
                          <div className='border-t border-border/60 bg-muted/10'>
                            <CardHeader className='pb-6 pt-8'>
                              <CardTitle className='text-lg flex items-center gap-3 font-black tracking-tight'>
                                <div className='p-2 bg-indigo-500/10 rounded-lg'>
                                  <MapPin
                                    size={20}
                                    className='text-indigo-600 dark:text-indigo-400'
                                  />
                                </div>
                                Riwayat Perjalanan
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className='space-y-10 relative before:absolute before:inset-0 before:ml-[1.4rem] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border/80 before:to-transparent pb-8'>
                                {data.shipment.events.map((event: any, index: number) => (
                                  <div
                                    key={index}
                                    className='relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active'
                                  >
                                    <div
                                      className={`flex items-center justify-center w-12 h-12 rounded-full border-4 border-card shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm ${
                                        index === 0
                                          ? 'bg-indigo-600 text-white'
                                          : 'bg-muted text-muted-foreground'
                                      }`}
                                    >
                                      {index === 0
                                        ? <CheckCircle2 size={20} />
                                        : (
                                          <div className='w-2.5 h-2.5 rounded-full bg-muted-foreground/40' />
                                        )}
                                    </div>
                                    <div className='w-[calc(100%-4.5rem)] md:w-[calc(50%-3rem)] p-5 rounded-2xl border border-border/60 bg-card shadow-sm hover:shadow-md hover:border-indigo-500/30 transition-all duration-300'>
                                      <div className='flex flex-col xl:flex-row xl:items-center justify-between mb-3 gap-2'>
                                        <div className='font-black text-foreground tracking-tight'>
                                          {event.status}
                                        </div>
                                        <time className='text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-lg w-fit shrink-0'>
                                          {new Date(event.occurredAt).toLocaleString('id-ID', {
                                            day: '2-digit',
                                            month: 'short',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                          })}
                                        </time>
                                      </div>
                                      <div className='text-muted-foreground text-sm leading-relaxed font-medium'>
                                        {event.description}
                                      </div>
                                      {event.location && (
                                        <div className='text-xs text-muted-foreground/80 mt-4 flex items-center gap-2 bg-muted/30 p-2 rounded-lg w-fit font-bold border border-border/30'>
                                          <MapPin size={14} className='shrink-0' />{' '}
                                          <span className='truncate max-w-[200px]'>
                                            {event.location}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </div>
                        )}
                      </>
                    )}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
