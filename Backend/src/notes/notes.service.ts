import { Injectable } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-notes.dto';
import { Result } from 'postcss';

@Injectable()
export class NotesService {

    private Notes: Array<CreateNoteDto> = [
        {id: 1705006307122, title: 'one', content: 'Hellow Word!', owner: 'DagmawiElias'},
        {id: 1705006307123, title: 'two', content: 'You there World?', owner: 'DagmawiElias'},
        {id: 1705006307124, title: 'three', content: 'Bye Word!', owner: 'DagmawiElias'},
        {id: 1705006307125, title: 'four',content: 'you still here?', owner: 'DagmawiElias'}
    ]

    getNote(id: number){
        let note =  this.Notes.find(note => note.id === id)

        if(!note) {throw new Error('Note not found')}

        return note
    }

    getNotes(){
        //video 4
        return this.Notes
    }

    update_notes(id: number, UpdateNoteDto: UpdateNoteDto){

        this.Notes = this.Notes.map( Nt => {
            if(Nt.id === id){
                return {...Nt, ...UpdateNoteDto};
            }

            return Nt
        })

        return this.getNote(id)
    }

    addNote(note: CreateNoteDto){

        let Trigger:boolean = true;

        this.Notes.map(nt =>{
            nt.id === note.id ? Trigger = false: null
        })

        Trigger? this.Notes.push({id: Date.now(), ...note}): null;
    }

    removeNote(ID: number){
        let removedNote = this.getNote(ID)
        this.Notes = this.Notes.filter(note => note.id !== ID)
        // return removedNote
        return this.getNotes()
    }
}
