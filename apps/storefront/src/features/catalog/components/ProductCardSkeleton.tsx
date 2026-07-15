import { Card, CardContent, CardFooter, Skeleton } from '@starsuperscare/ui';

export const ProductCardSkeleton = (): JSX.Element => {
  return (
    <Card className='flex flex-col h-full overflow-hidden'>
      {/* Image Area Skeleton */}
      <div className='aspect-square relative w-full'>
        <Skeleton className='w-full h-full rounded-none' />
      </div>

      <CardContent className='flex flex-col flex-grow p-4 gap-2'>
        <Skeleton className='h-4 w-1/3' />
        <Skeleton className='h-5 w-[85%] mt-1' />

        <div className='mt-auto pt-2'>
          <Skeleton className='h-6 w-1/2' />

          <div className='flex items-center gap-2 mt-3'>
            <Skeleton className='h-3 w-8' />
            <Skeleton className='h-3 w-16' />
          </div>
        </div>
      </CardContent>

      <CardFooter className='p-4 pt-0 gap-2 flex'>
        <Skeleton className='h-10 flex-1 rounded-md' />
        <Skeleton className='h-10 flex-1 rounded-md' />
      </CardFooter>
    </Card>
  );
};
