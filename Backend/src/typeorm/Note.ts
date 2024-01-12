import { Column, Entity, PrimaryGeneratedColumn, TableForeignKey } from "typeorm";
import { ForeignKeyMetadata } from "typeorm/metadata/ForeignKeyMetadata";

export class Note{
    @PrimaryGeneratedColumn()
    ID: number

    @Column()
    content: string
}