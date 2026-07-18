import { Button } from '@starsuperscare/ui';
import { useNotifications } from './useNotifications.ts';
import { Bell, Check, CheckCircle2, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const NotificationsPage = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, isLoading } = useNotifications();
  const navigate = useNavigate();

  return (
    <div className='max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12'>
      {/* ── Header ── */}
      <div className='flex flex-col sm:flex-row sm:items-end justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-black text-foreground tracking-tight flex items-center gap-3'>
            Notifikasi
            {(unreadCount ?? 0) > 0 && (
              <span className='inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 border border-indigo-500/20'>
                <span className='animate-pulse inline-block h-2 w-2 rounded-full bg-indigo-500' />
                {unreadCount} Baru
              </span>
            )}
          </h1>
          <p className='text-muted-foreground font-medium mt-1'>
            Pembaruan terbaru tentang akun dan status pesanan Anda.
          </p>
        </div>

        {(unreadCount ?? 0) > 0 && (
          <Button
            variant='outline'
            onClick={markAllAsRead}
            className='shrink-0 rounded-full font-bold border-border/60 hover:bg-muted/80'
          >
            <CheckCircle2 className='w-4 h-4 mr-2 text-emerald-500' />
            Tandai Semua Dibaca
          </Button>
        )}
      </div>

      {/* ── List ── */}
      <div className='space-y-4'>
        {isLoading
          ? (
            [1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className='animate-pulse bg-card border border-border/40 h-28 rounded-2xl'
              />
            ))
          )
          : notifications?.length === 0
          ? (
            <div className='text-center py-24 bg-card rounded-3xl border border-border/60 shadow-sm'>
              <div className='w-20 h-20 bg-muted/80 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner'>
                <Bell className='w-10 h-10 text-muted-foreground/50' />
              </div>
              <h3 className='text-xl font-bold text-foreground mb-2'>Tidak Ada Notifikasi</h3>
              <p className='text-muted-foreground font-medium text-sm max-w-sm mx-auto'>
                Pemberitahuan baru akan muncul di sini. Saat ini Anda telah membaca semua
                notifikasi.
              </p>
            </div>
          )
          : (
            notifications?.map((item: any) => {
              const isUnread = !item.readAt;

              return (
                <div
                  key={item.id}
                  className={`relative overflow-hidden group rounded-2xl border p-5 sm:p-6 transition-all duration-300 hover:shadow-md ${
                    isUnread
                      ? 'bg-card border-indigo-500/30 hover:border-indigo-500/50 shadow-sm'
                      : 'bg-muted/30 border-border/50 hover:bg-muted/60 opacity-90 hover:opacity-100'
                  }`}
                >
                  {isUnread && (
                    <div className='absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-violet-600 rounded-l-2xl'>
                    </div>
                  )}

                  <div className='flex flex-col sm:flex-row sm:items-start justify-between gap-5 pl-2 sm:pl-4'>
                    <div className='flex items-start gap-4'>
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-colors ${
                          isUnread
                            ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {isUnread ? <Bell className='w-6 h-6' /> : <Check className='w-6 h-6' />}
                      </div>
                      <div>
                        <div className='flex items-center gap-2 mb-1'>
                          <h4
                            className={`text-base font-bold ${
                              isUnread ? 'text-foreground' : 'text-foreground/80'
                            }`}
                          >
                            {item.title}
                          </h4>
                          {isUnread && (
                            <span className='inline-block px-2 py-0.5 rounded bg-amber-500/10 text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider'>
                              Baru
                            </span>
                          )}
                        </div>
                        <p
                          className={`text-sm ${
                            isUnread
                              ? 'text-muted-foreground font-medium'
                              : 'text-muted-foreground/80'
                          }`}
                        >
                          {item.body}
                        </p>
                        <p className='text-xs font-semibold text-muted-foreground/60 mt-2.5 flex items-center gap-1.5 uppercase tracking-wider'>
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

                    <div className='flex items-center sm:flex-col sm:items-end gap-2.5 pt-3 sm:pt-0 border-t sm:border-0 border-border/40 ml-16 sm:ml-0'>
                      {isUnread && (
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => markAsRead(item.id)}
                          className='h-9 px-4 rounded-full text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/10'
                        >
                          <CheckCircle2 className='w-3.5 h-3.5 mr-1.5' /> Tandai Dibaca
                        </Button>
                      )}
                      {item.actionUrl && (
                        <Button
                          variant={isUnread ? 'default' : 'outline'}
                          size='sm'
                          className={`h-9 px-4 rounded-full text-xs font-bold shadow-sm ${
                            isUnread
                              ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                              : 'border-border/60 bg-card hover:bg-muted'
                          }`}
                          onClick={() => {
                            if (!item.readAt) markAsRead(item.id);
                            if (item.actionUrl.startsWith('http')) {
                              globalThis.open(item.actionUrl, '_blank');
                            } else {
                              navigate(item.actionUrl);
                            }
                          }}
                        >
                          Lihat Detail <ExternalLink className='w-3.5 h-3.5 ml-1.5 opacity-70' />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
      </div>
    </div>
  );
};
