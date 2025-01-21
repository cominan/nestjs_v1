import { Role } from 'src/config/role/roles.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  name: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column()
  type_login: string;

  @Column()
  roles: string;
}
