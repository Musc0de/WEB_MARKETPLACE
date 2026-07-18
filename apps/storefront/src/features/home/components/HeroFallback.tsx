import { H1, Text } from '@starsuperscare/ui';

export function HeroFallback() {
  return (
    <div className='bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-2xl p-8 sm:p-12 h-full flex flex-col justify-center border border-slate-200 dark:border-slate-700'>
      <div className='max-w-2xl'>
        <H1 className='text-slate-800 dark:text-slate-100'>Selamat Datang di StarSuperScare</H1>
        <Text className='text-slate-600 dark:text-slate-300 mt-4 text-lg'>
          Marketplace terbaik untuk menemukan segala kebutuhan Anda.
        </Text>
      </div>
    </div>
  );
}
