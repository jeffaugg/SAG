import { Expose, plainToInstance } from 'class-transformer';
import { IsEnum, IsNumber, IsString, validateSync } from 'class-validator';

enum Environment {
    development = 'development',
    production = 'production',
}
type EnvironmentEnum = keyof typeof Environment;

export class EnvironmentVariables {
    @Expose()
    @IsEnum(Environment)
    ENVIRONMENT: EnvironmentEnum;
    @Expose()
    @IsString()
    DATABASE_URL: string;

    @Expose()
    @IsString()
    MONGO_URI: string;

    @Expose()
    @IsString()
    JWT_SECRET: string;

    @Expose()
    @IsNumber()
    SERVER_PORT: number;

    @Expose()
    @IsString()
    REDIS_HOST: string;

    @Expose()
    @IsString()
    REDIS_PASSWORD: string;

    @Expose()
    @IsString()
    MINIO_ROOT_USER: string;

    @Expose()
    @IsString()
    MINIO_ROOT_PASSWORD: string;

    @Expose()
    @IsString()
    S3_REGION: string;

    @Expose()
    @IsString()
    S3_ENDPOINT: string;

    @Expose()
    @IsString()
    S3_FORCE_PATH_STYLE: string;

    @Expose()
    @IsString()
    ADM_PASSWORD: string;

    @Expose()
    @IsString()
    ADM_CPF: string;
}

const validateEnvironmentsVariables = (): EnvironmentVariables => {
    cleanEnv(process.env);

    const configInstance = plainToInstance(EnvironmentVariables, process.env, {
        enableImplicitConversion: true,
        excludeExtraneousValues: true,
        exposeDefaultValues: true,
    });

    const errors = validateSync(configInstance, {});

    if (errors.length) throw new Error(JSON.stringify(errors, undefined, 2));

    return configInstance;
};

/**
 * This method iterates over all environment variables and removes any
 * surrounding single or double quotes. This is necessary because
 * environment variables injected through some services or tools,
 * like Docker or Infisical, might include quotes which can cause
 * issues in the application.
 *
 * @param env - The process.env object containing all environment variables
 */
const cleanEnv = (env: NodeJS.ProcessEnv): void => {
    for (const key in env) {
        if (env.hasOwnProperty(key)) {
            const value = env[key];
            if (typeof value === 'string') {
                env[key] = value.replace(/^['"]+|['"]+$/g, '');
            }
        }
    }
};

export const config = validateEnvironmentsVariables();
