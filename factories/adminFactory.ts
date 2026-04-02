import { faker } from '@faker-js/faker';
import { getNextUniqueId } from './UniqueId';

export interface TestGroup {
    name: string;
    description: string;
    roles: string[];
    members: string[];
}

export interface TestUser {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    groups: string[];
    roles: string[];
}

export interface TestCredential {
    name: string;
    path: string;
}

export interface TestTokenCredential extends TestCredential {
    token: string;
}

export interface TestUsernamePasswordCredential extends TestCredential {
    username: string;
    password: string;
}

export interface TestApiKey {
    name: string;
    id: string;
    roles: string[];
}

export class AdminFactory {
    static createCredential(overrides: Partial<TestCredential> = {}): TestCredential {
        const id = getNextUniqueId();
        const name = faker.word.sample();
        return {
            name: `${name} ${id}`,
            path: `${name}/${id}`,
            ...overrides
        };
    }

    static createTokenCredential(
        overrides: Partial<TestTokenCredential> = {}
    ): TestTokenCredential {
        const id = getNextUniqueId();
        const name = faker.word.sample();
        return {
            name: `${name}${id}`,
            path: `${name}/${id}`,
            token: faker.string.alphanumeric(32),
            ...overrides
        };
    }

    static createUsernamePasswordCredential(
        overrides: Partial<TestUsernamePasswordCredential> = {}
    ): TestUsernamePasswordCredential {
        const id = getNextUniqueId();
        const name = faker.word.sample();
        return {
            name: `${name}${id}`,
            path: `${name}/${id}`,
            username: faker.internet.username(),
            password: faker.internet.password({ length: 12 }),
            ...overrides
        };
    }

    static createGroup(overrides: Partial<TestGroup> = {}): TestGroup {
        const id = getNextUniqueId();
        const name = faker.company.name();
        const description = faker.lorem.sentence();
        return {
            name: `${name} ${id}`,
            description,
            roles: [],
            members: [],
            ...overrides
        };
    }

    static createUser(overrides: Partial<TestUser> = {}): TestUser {
        const id = getNextUniqueId();
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const username = `${firstName.toLowerCase()}-${id}`;
        return {
            username,
            firstName,
            lastName,
            email: faker.internet.email({ firstName: username, lastName }),
            password: faker.internet.password({ length: 12 }),
            groups: [],
            roles: [],
            ...overrides
        };
    }

    static createApiKey(overrides: Partial<TestApiKey> = {}): TestApiKey {
        const id = getNextUniqueId();
        const name = faker.word.sample();
        return {
            name: `${name} ${id}`,
            id: `${name}-${id}`,
            roles: [],
            ...overrides
        };
    }
}
