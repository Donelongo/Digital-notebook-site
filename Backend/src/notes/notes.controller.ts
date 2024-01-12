import { Controller, Delete, Get, Param, Post, Put, Query, Body, NotFoundException, ParseIntPipe } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-notes.dto';
import { NotesService } from './notes.service';

@Controller('notes')
export class NotesController {

constructor(private readonly NotesService: NotesService){}

// get /notes
@Get()
get_notes(){
    try {
        return this.NotesService.getNotes()
    } catch (err) {
        throw new NotFoundException()
    }
}

// get /note/:id
@Get(':id')
get_note(@Param('id', ParseIntPipe) ID: number){
    return this.NotesService.getNote(ID)
}

// update /note/:id
@Put(':id')
updateNote(@Param('id', ParseIntPipe) ID: number, @Body() NoteUpdate: UpdateNoteDto){
    this.NotesService.update_notes(ID, NoteUpdate)
    return this.NotesService.getNote(ID)
}

// delete /note/:id
@Delete(':id')
deleteNote(@Param('id', ParseIntPipe) ID: number){
    return this.NotesService.removeNote(ID)
}

// post /notes
@Post()
createNote(@Body() postBody: CreateNoteDto[]){
    console.log(postBody)
    postBody.map(post => this.NotesService.addNote(post))
    return this.NotesService.getNotes()
}

}


