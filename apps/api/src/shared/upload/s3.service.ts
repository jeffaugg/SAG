import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Readable } from 'stream';
import {
    S3Client,
    HeadBucketCommand,
    CreateBucketCommand,
    PutObjectCommand,
    GetObjectCommand,
} from '@aws-sdk/client-s3';
import { v4 as uuid } from 'uuid';
import { S3_CLIENT } from 'src/common/constants';

@Injectable()
export class S3Service implements OnModuleInit {
    private bucket = process.env.AWS_S3_BUCKET;

    constructor(
        @Inject(S3_CLIENT)
        private readonly s3Client: S3Client,
    ) {}

    async onModuleInit() {
        console.log(
            'Bucket configurado em S3Service:',
            process.env.AWS_S3_BUCKET,
        );

        try {
            await this.s3Client.send(
                new HeadBucketCommand({ Bucket: this.bucket }),
            );
        } catch {
            await this.s3Client.send(
                new CreateBucketCommand({ Bucket: this.bucket }),
            );
        }
    }

    async uploadFile(file: Express.Multer.File): Promise<string> {
        const url = `${Date.now()}-${uuid()}-${file.fieldname}`;
        await this.s3Client.send(
            new PutObjectCommand({
                Bucket: this.bucket,
                Key: url,
                Body: file.buffer,
                ContentType: file.mimetype,
                ACL: 'public-read',
            }),
        );
        return url;
    }

    async getFileStream(url: string): Promise<Readable> {
        const { Body } = await this.s3Client.send(
            new GetObjectCommand({ Bucket: this.bucket, Key: url }),
        );
        return Body as Readable;
    }
}
