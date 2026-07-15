import { Badge, Button, Card } from '@starsuperscare/ui';
import { useNotifications } from './useNotifications.ts';
import { Bell, Check, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const NotificationsPage = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, isLoading } = useNotifications();
  const navigate = useNavigate();

  return (
    <div className='max-w-4xl mx-auto space-y-6'>
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-bold text-white flex items-center gap-2'>
            Notifikasi
            {(unreadCount ?? 0) > 0 && (
              <Badge variant='default' className='bg-primary text-primary-foreground'>
                {unreadCount} Baru
              </Badge>
            )}
          </h1>
          <p className='text-muted-foreground mt-1'>
            Pembaruan terbaru tentang akun dan pesanan Anda.
          </p>
        </div>

        {(unreadCount ?? 0) > 0 && (
          <Button variant='outline' onClick={markAllAsRead} className='shrink-0'>
            <Check className='w-4 h-4 mr-2' />
            Tandai Semua Dibaca
          </Button>
        )}
      </div>

      <div className='space-y-4'>
        {isLoading
          ? (
            [1, 2, 3].map((i) => (
              <Card key={i} className='animate-pulse bg-white/5 border-white/10 h-24' />
            ))
          )
          : notifications?.length === 0
          ? (
            <div className='text-center py-20 bg-white/5 rounded-xl border border-white/10'>
              <Bell className='w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50' />
              <h3 className='text-lg font-medium text-white mb-2'>Tidak Ada Notifikasi</h3>
              <p className='text-muted-foreground text-sm'>
                Anda sudah membaca semua pemberitahuan.
              </p>
            </div>
          )
          : (
            notifications?.map((item: any) => (
              <Card
                key={item.id}
                className={`p-4 border-white/10 transition-colors ${
                  !item.readAt ? 'bg-[#0f1115] border-primary/30' : 'bg-[#0f1115]/50 opacity-80'
                }`}
              >
                <div className='flex items-start justify-between gap-4'>
                  <div className='flex items-start gap-4'>
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        !item.readAt
                          ? 'bg-primary/20 text-primary'
                          : 'bg-white/10 text-muted-foreground'
                      }`}
                    >
                      <Bell className='w-5 h-5' />
                    </div>
                    <div>
                      <h4
                        className={`font-medium ${!item.readAt ? 'text-white' : 'text-gray-300'}`}
                      >
                        {item.title}
                      </h4>
                      <p className='text-sm text-muted-foreground mt-1'>
                        {item.body}
                      </p>
                      <p className='text-xs text-muted-foreground/50 mt-2'>
                        {new Date(item.createdAt).toLocaleString('id-ID', {
                          timeZone: 'Asia/Jakarta',
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })} WIB
                      </p>
                    </div>
                  </div>

                  <div className='flex flex-col items-end gap-2'>
                    {!item.readAt && (
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => markAsRead(item.id)}
                        className='h-8 text-xs'
                      >
                        Tandai Dibaca
                      </Button>
                    )}
                    {item.actionUrl && (
                      <Button
                        variant='outline'
                        size='sm'
                        className='h-8 text-xs'
                        onClick={() => {
                          if (!item.readAt) markAsRead(item.id);
                          if (item.actionUrl.startsWith('http')) {
                            globalThis.open(item.actionUrl, '_blank');
                          } else {
                            navigate(item.actionUrl);
                          }
                        }}
                      >
                        Lihat <ExternalLink className='w-3 h-3 ml-2' />
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
      </div>
    </div>
  );
};
