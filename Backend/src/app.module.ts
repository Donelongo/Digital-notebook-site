import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { NotesModule } from './notes/notes.module';
import { User } from './users/entities/user.entity';
import { Note } from './notes/entities/note.entity';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import entities from './typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "mysql",
      host: "localhost",
      port: 3306,
      username: "root",
      password: "123321",
      database: "echodb",
      entities,
      synchronize: true,
    }),
    UsersModule,
    NotesModule,
    AuthModule,
    TypeOrmModule.forFeature([User, Note]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
