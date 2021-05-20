import {
  Entity, Column, PrimaryGeneratedColumn, ManyToMany, 
  BaseEntity, JoinTable, OneToMany
} from 'typeorm';

import {Todos} from './Todos'

@Entity()
export class Users extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({unique: true})
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Todos, todos => todos.user)
    todos: Todos[];
}