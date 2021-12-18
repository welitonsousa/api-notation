import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";
import { v4 as uuid } from 'uuid';

@Entity('todo')
class Todo {
  @PrimaryColumn()
  readonly id: string;

  @Column()
  title: string;

  @Column()
  userId: string;

  @Column()
  tasks: string;

  @CreateDateColumn({default: new Date()})
  created_at: Date;

  @CreateDateColumn({default: new Date()})
  updated_at: Date;

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}

export { Todo }