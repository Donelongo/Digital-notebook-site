import{Column, Entity, PrimaryGeneratedColumn, OneToMany} from "typeorm";
import { Note } from '../../notes/entities/note.entity';


@Entity('User')
export class User{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    name: string;

    @Column({unique:true})
    email:string;

    @Column()
    password: string;

    @Column({ default: 'user' }) 
    role: string;

    @OneToMany(() => Note, (note) => note.user)
    notes: Note[];
}