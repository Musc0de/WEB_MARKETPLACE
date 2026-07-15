import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import { Package, Truck, CheckCircle2, MapPin, PackageX, ChevronLeft, ChevronDown } from 'lucide-react';

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
  const tokens = token ? token.split(',').map(t => t.trim()).filter(Boolean).slice(0, 10) : [];
  
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
            return { token: t, error: res.status === 404 ? 'Informasi Pelacakan Tidak Tersedia' : 'Gagal memuat status' };
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
    setOpenPanels(prev => ({ ...prev, [t]: !prev[t] }));
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
      <div className='max-w-3xl mx-auto px-4 py-12'>
        <button 
          type='button'
          onClick={() => navigate(-1)} 
          className='flex items-center text-blue-600 hover:text-blue-800 mb-6 font-medium transition-colors'
        >
          <ChevronLeft size={20} className='mr-1' /> Kembali
        </button>
        <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center'>
          <div className='w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4'>
            <PackageX size={32} />
          </div>
          <h2 className='text-xl font-bold text-gray-900 mb-2'>{error || 'Paket tidak ditemukan'}</h2>
          <p className='text-gray-500'>Silakan periksa kembali Nomor Resi atau Tautan Anda.</p>
        </div>
      </div>
    );
  }

  return (
    <div className='max-w-3xl mx-auto px-4 py-8 md:py-12 space-y-6'>
      <div className='flex items-center gap-4 pb-2'>
        <button 
          type='button'
          onClick={() => navigate(-1)} 
          className='flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors border border-blue-100 bg-blue-50/50 hover:bg-blue-100 px-3 py-1.5 rounded-md'
        >
          <ChevronLeft size={18} className='mr-1' /> Kembali
        </button>
      </div>
      
      <div className='flex items-center gap-4 border-b border-gray-200 pb-6'>
        <div className='p-3 bg-blue-100 text-blue-600 rounded-lg'>
          <Truck size={24} />
        </div>
        <div>
          <H3 className='!mt-0'>Pelacakan Paket</H3>
          <p className='text-gray-500 text-sm'>{results.length > 1 ? `Menampilkan ${results.length} resi secara bulk` : 'Detail pengiriman Anda'}</p>
        </div>
      </div>

      <div className='space-y-6'>
        {results.map((result) => {
          const isOpen = openPanels[result.token];
          const hasError = !!result.error;
          const data = result.data;

          return (
            <Card key={result.token} className={`shadow-sm border-gray-100 overflow-hidden transition-all duration-200 ${isOpen ? 'ring-2 ring-blue-50' : 'hover:border-blue-200'}`}>
              <div 
                className='p-4 md:p-5 flex items-center justify-between cursor-pointer bg-white hover:bg-gray-50 transition-colors select-none group'
                onClick={() => togglePanel(result.token)}
              >
                <div className='flex items-center gap-4'>
                  <div className={`p-2 rounded-md ${hasError ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-600'}`}>
                    {hasError ? <PackageX size={20} /> : <Package size={20} />}
                  </div>
                  <div>
                    <div className='font-bold text-gray-900'>{result.token}</div>
                    <div className='text-sm text-gray-500'>
                      {hasError ? 'Gagal dilacak' : (data?.shipment?.courier || 'Informasi kurir tidak tersedia')}
                    </div>
                  </div>
                </div>
                <div className='flex items-center gap-4'>
                  {!hasError && data?.shipment?.status && (
                    <Badge variant='outline' className='bg-green-50 text-green-700 border-green-200 hidden sm:inline-flex'>
                      {data.shipment.status.toUpperCase().replace(/_/g, ' ')}
                    </Badge>
                  )}
                  <div className={`p-1 rounded-full group-hover:bg-gray-200 transition-colors ${isOpen ? 'bg-gray-100' : ''}`}>
                    <ChevronDown size={20} className={`text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                  </div>
                </div>
              </div>

              {isOpen && (
                <div className='border-t border-gray-100 animate-in slide-in-from-top-2 fade-in duration-200'>
                  {hasError ? (
                    <div className='p-8 text-center text-gray-500 bg-gray-50'>
                      <PackageX size={24} className='mx-auto mb-2 text-gray-400' />
                      {result.error}
                    </div>
                  ) : (
                    <>
                      <CardContent className='space-y-4 pt-6'>
                        <div className='flex items-center justify-between border-b border-gray-100 pb-4'>
                          <Small className='text-gray-500'>Status Pesanan</Small>
                          <Badge variant='outline' className='bg-blue-50 text-blue-700 border-blue-200'>
                            {data.orderStatus.toUpperCase().replace(/_/g, ' ')}
                          </Badge>
                        </div>

                        {data.shipment ? (
                          <>
                            <div className='flex items-center justify-between border-b border-gray-100 pb-4'>
                              <Small className='text-gray-500'>Kurir</Small>
                              <div className='flex items-center gap-3'>
                                <CourierLogo courier={data.shipment.courier} />
                                <Text className='font-semibold !mt-0'>{data.shipment.courier}</Text>
                              </div>
                            </div>

                            <div className='flex justify-between border-b border-gray-100 pb-4'>
                              <Small className='text-gray-500'>Nomor Resi</Small>
                              <Text className='font-mono bg-gray-100 px-2 py-1 rounded text-sm'>{data.shipment.trackingNumber}</Text>
                            </div>

                            <div className='flex justify-between pb-2'>
                              <Small className='text-gray-500'>Estimasi Tiba</Small>
                              <Text className='!mt-0 font-medium text-gray-900'>
                                {data.shipment.estimatedDeliveryAt
                                  ? new Date(data.shipment.estimatedDeliveryAt).toLocaleDateString('id-ID', {
                                      weekday: 'long',
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric'
                                    })
                                  : 'Menunggu penjemputan'}
                              </Text>
                            </div>
                          </>
                        ) : (
                          <div className='py-4 text-center text-gray-500'>
                            Belum ada informasi pengiriman untuk pesanan ini.
                          </div>
                        )}
                      </CardContent>

                      {data.shipment && data.shipment.events.length > 0 && (
                        <div className='border-t border-gray-100 bg-gray-50/30'>
                          <CardHeader className='pb-4 pt-6'>
                            <CardTitle className='text-md flex items-center gap-2'>
                              <MapPin size={18} className='text-gray-500' />
                              Riwayat Perjalanan
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className='space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent pb-6'>
                              {data.shipment.events.map((event: any, index: number) => (
                                <div key={index} className='relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active'>
                                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm ${index === 0 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                                    {index === 0 ? <CheckCircle2 size={16} /> : <div className='w-2 h-2 rounded-full bg-gray-400' />}
                                  </div>
                                  <div className='w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow'>
                                    <div className='flex flex-col xl:flex-row xl:items-center justify-between mb-2 gap-1'>
                                      <div className='font-bold text-gray-900'>{event.status}</div>
                                      <time className='text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full w-fit'>
                                        {new Date(event.occurredAt).toLocaleString('id-ID', {
                                          day: '2-digit',
                                          month: 'short',
                                          hour: '2-digit',
                                          minute: '2-digit'
                                        })}
                                      </time>
                                    </div>
                                    <div className='text-gray-600 text-sm leading-relaxed'>
                                      {event.description}
                                    </div>
                                    {event.location && (
                                      <div className='text-xs text-gray-400 mt-3 flex items-center gap-1.5 bg-gray-50 p-1.5 rounded-md w-fit'>
                                        <MapPin size={12} className="shrink-0" /> <span className="truncate max-w-[200px]">{event.location}</span>
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
