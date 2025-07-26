/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
    registerDecorator,
    ValidationOptions,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class ExclusiveOrConstraint implements ValidatorConstraintInterface {
    validate(_: any, args: ValidationArguments) {
        const obj = args.object as any;
        const [prop1, prop2] = args.constraints as string[];
        const has1 = !!obj[prop1];
        const has2 = !!obj[prop2];
        return (has1 || has2) && !(has1 && has2);
    }

    defaultMessage(args: ValidationArguments) {
        const [prop1, prop2] = args.constraints as string[];
        return `Você deve informar *apenas um* dos campos: ${prop1} ou ${prop2}.`;
    }
}

export function ExclusiveOr(
    props: string[],
    validationOptions?: ValidationOptions,
) {
    return (object: object, propertyName: string) => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: props,
            validator: ExclusiveOrConstraint,
        });
    };
}
