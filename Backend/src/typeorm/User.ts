import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export class User{
    @PrimaryGeneratedColumn()
    user_name: string

    @Column({
        nullable: false
    })
    email: string

    @Column({
        nullable: false
    })
    password: string
}