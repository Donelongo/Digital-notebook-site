// note/note.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Note } from './entities/note.entity';
import { NoteRepository } from './notes.repository';
import { NotesController } from './notes.controller';
import { NoteService } from './notes.service';

@Module({
  imports: [TypeOrmModule.forFeature([Note, NoteRepository])],
  controllers: [NotesController],
  providers: [NoteService],
})
export class NoteModule {}
