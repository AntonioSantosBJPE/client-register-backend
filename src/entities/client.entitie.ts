import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Contact } from "./index";

@Entity("clients")
export class Client {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: "150" })
  name: string;

  @Column({ type: "varchar", length: "45", unique: true })
  email: string;

  @Column({ type: "varchar", length: "11" })
  phone: string;

  @Column({ type: "varchar", length: "120" })
  password: string;

  @CreateDateColumn({ type: "date" })
  createdAt: string;

  @UpdateDateColumn({ type: "date" })
  updatedAt: string;

  @DeleteDateColumn({ type: "date" })
  deletedAt: string;

  @OneToMany(() => Contact, (contact) => contact.client)
  contacts: Contact[];
}
