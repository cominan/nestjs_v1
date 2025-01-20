import { DataSource } from 'typeorm';
import { User } from './users/entities/user.entity';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'cockroachdb',
        host: 'glade-possum-7126.j77.aws-ap-southeast-1.cockroachlabs.cloud',
        port: 26257,
        username: 'hungpv',
        password: '3VHsRRodIyzFDSovPGV18w',
        database: 'defaultdb',
        timeTravelQueries: false,
        synchronize: false,
        extra: { ssl: { rejectUnauthorized: false } },
        // entities: [__dirname + '/../**/*.entity{.ts,.js}']
        entities: [User],
      });
      return dataSource.initialize();
    },
  },
];
