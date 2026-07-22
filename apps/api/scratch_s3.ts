import { ListObjectsV2Command, S3Client } from 'npm:@aws-sdk/client-s3@3';
import { load } from 'https://deno.land/std@0.224.0/dotenv/mod.ts';
const env = await load({ envPath: '../../.env' });
const s3 = new S3Client({
  region: 'auto',
  endpoint: 'https://' + env['R2_ACCOUNT_ID_2'] + '.r2.cloudflarestorage.com',
  credentials: {
    accessKeyId: env['R2_ACCESS_KEY_ID_2'],
    secretAccessKey: env['R2_SECRET_ACCESS_KEY_2'],
  },
});
try {
  await s3.send(new ListObjectsV2Command({ Bucket: env['R2_BUCKET_NAME_2'], MaxKeys: 1 }));
  console.log('SUCCESS');
} catch (e) {
  console.error('ERROR:', e.name, e.message);
}
