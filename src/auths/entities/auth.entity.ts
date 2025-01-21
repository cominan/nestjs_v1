import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'auth'})
export class Auth {
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
