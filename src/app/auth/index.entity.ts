import { User } from "@app/user/index.entity";
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("auth_identities")
export class AuthIdentity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 500,
    type: "varchar",
    nullable: true,
  })
  refresh_token: string;

  @Column({
    length: 500,
    type: "varchar",
    nullable: true,
  })
  email_verification_token: string;

  @Column({
    type: "datetime",
    nullable: true,
  })
  email_verification_valid_until: string;

  @Column({
    length: 500,
    type: "varchar",
    nullable: true,
  })
  password_reset_token: string;

  @Column({
    type: "datetime",
    nullable: true,
  })
  password_reset_valid_until: string;

  @OneToOne(() => User, (user) => user.auth)
  @JoinColumn({ name: "user_id" })
  user: User;
}
