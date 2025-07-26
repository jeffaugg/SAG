import { Module, Global } from '@nestjs/common';
import { S3Client } from '@aws-sdk/client-s3';
import { config } from '../config/environments';
import { S3_CLIENT, S3_SERVICE } from 'src/common/constants';
import { S3Service } from './s3.service';

@Global()
@Module({
    providers: [
        {
            provide: S3_CLIENT,
            useFactory: () => {
                return new S3Client({
                    endpoint: config.S3_ENDPOINT,
                    region: config.S3_REGION,
                    credentials: {
                        accessKeyId: config.MINIO_ROOT_USER,
                        secretAccessKey: config.MINIO_ROOT_PASSWORD,
                    },
                    forcePathStyle: true,
                });
            },
        },
        {
            provide: S3_SERVICE,
            useClass: S3Service,
        },
    ],
    exports: [S3_CLIENT, S3_SERVICE],
})
export class S3Module {}
