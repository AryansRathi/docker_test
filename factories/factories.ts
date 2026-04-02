import { AdminFactory } from './adminFactory';
import { DataModelFactory } from './dataModelFactory';
import { DataSourceFactory } from './dataSourceFactory';
import { PrimitivesFactory } from './primitivesFactory';

export interface Factories {
    admin: typeof AdminFactory;
    dataModel: typeof DataModelFactory;
    dataSource: typeof DataSourceFactory;
    primitives: typeof PrimitivesFactory;
}

export const factories: Factories = {
    admin: AdminFactory,
    dataModel: DataModelFactory,
    dataSource: DataSourceFactory,
    primitives: PrimitivesFactory
};
