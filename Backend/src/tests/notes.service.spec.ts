import { Test, TestingModule } from '@nestjs/testing';
import { NoteService } from '../notes/notes.service';
import { NoteRepository } from '../notes/notes.repository';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { Note } from '../notes/entities/note.entity';
import { User } from '../users/entities/user.entity';
import { CreateNoteDto } from '../notes/dto/create-note.dto';

describe('NoteService', () => {
  let service: NoteService;
  let noteRepository: NoteRepository;

  const mockUser: User = new User();
  mockUser.id = 1;
  mockUser.role = 'User';

  const mockNote: Note = new Note();
  mockNote.id = 1;
  mockNote.user = mockUser;
  mockNote.title = 'Sample Note';
  mockNote.content = 'This is a sample note.';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NoteService,
        {
          provide: NoteRepository,
          useValue: {
            create: jest.fn().mockReturnValue(mockNote),
            save: jest.fn().mockResolvedValue(mockNote),
            find: jest.fn().mockResolvedValue([mockNote]),
            findOne: jest.fn(),
            findOneById: jest.fn().mockResolvedValue(mockNote),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<NoteService>(NoteService);
    noteRepository = module.get<NoteRepository>(NoteRepository);
  });

  describe('create', () => {
    it('should successfully create a note', async () => {
      const createNoteDto: CreateNoteDto = {
        title: 'New Note',
        content: 'Content of the new note',
      };

      const result = await service.create(mockUser, createNoteDto);
      expect(result).toEqual(mockNote);
      expect(noteRepository.create).toHaveBeenCalledWith({
        ...createNoteDto,
        user: mockUser,
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of notes', async () => {
      const result = await service.findAll(mockUser);
      expect(result).toEqual([mockNote]);
    });
  });

  describe('findOne', () => {
    it('should return a specific note', async () => {
      jest.spyOn(noteRepository, 'findOneById').mockResolvedValueOnce(mockNote);
      const result = await service.findOne(mockUser, mockNote.id);
      expect(result).toEqual(mockNote);
    });

    it('should throw ForbiddenException for unauthorized access', async () => {
      const otherUser = new User();
      otherUser.id = 2;
      otherUser.role = 'User';

      jest.spyOn(noteRepository, 'findOneById').mockResolvedValueOnce(mockNote);

      await expect(service.findOne(otherUser, mockNote.id)).rejects.toThrow(ForbiddenException);
    });
  
  });

  describe('update', () => {
    it('should update a note', async () => {
      jest.spyOn(noteRepository, 'findOneById').mockResolvedValueOnce(mockNote);
      jest.spyOn(noteRepository, 'save').mockImplementationOnce(async (note: Note) => {
        return Promise.resolve({ ...note, title: updatedTitle, content: updatedContent });
      });
  
      const updatedTitle = 'Updated Title';
      const updatedContent = 'Updated Content';
      const updatedNote = await service.update(mockUser, mockNote.id, updatedTitle, updatedContent);
  
      expect(updatedNote.title).toBe(updatedTitle);
      expect(updatedNote.content).toBe(updatedContent);
    });
});

describe('remove', () => {
    it('should remove a note', async () => {
      jest.spyOn(noteRepository, 'findOneById').mockResolvedValueOnce(mockNote);
      jest.spyOn(noteRepository, 'remove').mockResolvedValueOnce(undefined); // Mock the remove method
  
      await expect(service.remove(mockUser, mockNote.id)).resolves.not.toThrow();
    });
  });

});
