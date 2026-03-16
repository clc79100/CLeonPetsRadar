import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmailModule } from './email/email.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './core/db/data-source';
import { PetsModule } from './pets/pets.module';

@Module({
  imports: [
    EmailModule,
    PetsModule,
    TypeOrmModule.forRoot(dataSourceOptions)
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
