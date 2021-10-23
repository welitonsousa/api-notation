import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";
import { v4 as uuid } from 'uuid';

@Entity('hashs')
class Hashs {
  @PrimaryColumn()
  readonly id: string;

  @Column()
  email: string;

  @Column()
  hash: string;

  @Column({default: true})
  valid: boolean;

  @CreateDateColumn()
  created_at: Date;

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}

export { Hashs }