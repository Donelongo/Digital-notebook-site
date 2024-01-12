import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { Note } from './notes/entities/note.entity';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from './users/users.module';
import { RolesGuard } from './users/guards/roles.guard'; // Adjust the path accordingly
import { NoteModule } from './notes/notes.module';
import { UserRepository } from './users/users.repository';
import { truncate } from 'fs/promises';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository]),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      database: 'echo',
      entities: [User, Note],
      synchronize: false,
      logging: true,
      username: 'root',
      password: '123321',
    }),
    TypeOrmModule.forFeature([User, Note]),
    JwtModule.register({
      secret: 'secret',
      signOptions: { expiresIn: '1d' },
    }),
    UserModule,
    NoteModule,
    AppModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: 'APP_GUARD', useClass: RolesGuard }, // Provide RolesGuard as a global guard
  ],
})
export class AppModule {}
