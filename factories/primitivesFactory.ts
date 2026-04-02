import { faker } from '@faker-js/faker';
import { getNextUniqueId } from './UniqueId';

export const PrimitivesFactory = {
    // Provide either both minLength and maxLength or neither
    createWord(minLength?: number, maxLength?: number): string {
        const id = getNextUniqueId();
        const word =
            minLength && maxLength
                ? faker.word.sample({ length: { min: minLength - 5, max: maxLength - 5 } })
                : faker.word.sample();
        return `${word}-${id}`;
    },

    createSentence(): string {
        const id = getNextUniqueId();
        const sentence = faker.lorem.sentence();
        return `${sentence} ${id}`;
    },

    createEmail(): string {
        const id = getNextUniqueId();
        return faker.internet.email({ provider: `${id}.com` });
    },

    createName(): string {
        const id = getNextUniqueId();
        return faker.person.fullName({ lastName: id });
    },

    createInteger({ min, max }: { min?: number; max?: number } = {}): number {
        return faker.number.int({ min: min, max: max });
    }
};
