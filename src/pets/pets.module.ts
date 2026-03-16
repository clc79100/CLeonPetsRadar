import { Module } from '@nestjs/common';
import { PetsService } from './pets.service';
import { PetsController } from './pets.controller';
import { EmailModule } from 'src/email/email.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LostPet } from 'src/core/db/entities/lost-pet.entity';
import { FoundPet } from 'src/core/db/entities/found-pet.entity';

@Module({
  imports: [
    EmailModule,
    TypeOrmModule.forFeature([LostPet, FoundPet])
  ],
  providers: [PetsService],
  controllers: [PetsController]
})
export class PetsModule {}
