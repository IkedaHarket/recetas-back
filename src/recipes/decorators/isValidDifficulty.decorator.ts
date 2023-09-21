import { ValidationOptions, registerDecorator } from 'class-validator';
import { RECIPES_DIFFICULTY } from '../interfaces';

export function IsValidDifficulty(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isValidDifficulty',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return Object.values(RECIPES_DIFFICULTY).includes(value);
        },
        defaultMessage() {
          return `La dificultad ingresada no es valida`;
        },
      },
    });
  };
}