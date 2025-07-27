import {
    applyDecorators,
    UseInterceptors,
    BadRequestException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

export function PdfFiles(fieldName: string, maxCount = 5, maxSizeMB = 10) {
    return applyDecorators(
        UseInterceptors(
            FilesInterceptor(fieldName, maxCount, {
                fileFilter: (req, file, cb) => {
                    if (file.mimetype === 'application/pdf') {
                        cb(null, true);
                    } else {
                        cb(
                            new BadRequestException(
                                'Apenas arquivos PDF são permitidos',
                            ),
                            false,
                        );
                    }
                },
                limits: {
                    fileSize: maxSizeMB * 1024 * 1024,
                },
            }),
        ),
    );
}
