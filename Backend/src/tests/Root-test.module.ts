// root-test.module.ts
import { Module } from '@nestjs/common';
import { NoteModule } from '../notes/notes.module'; // Import the module you are testing
import { NoteService } from '../notes/notes.service'; // If needed, you can include additional services for testing
import { NoteRepository } from '../notes/notes.repository';
import { UserModule } from '../users/users.module'; // Import the module you are testing
import { UsersService } from '../users/users.service'; // If needed, you can include additional services for testing
import { UserRepository } from '../users/users.repository';
import { AppModule } from '../app.module'; // Import the module you are testing
import { AppService } from '../app.service'; // If needed, you can include additional services for testing

@Module({
  imports: [NoteModule, UserModule, AppModule], // Include the module you want to test
  providers: [NoteService, NoteRepository, UsersService, UserRepository, AppService], // Include any additional services needed for testing
})
export class RootTestModule {}
