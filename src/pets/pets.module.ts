import { Module } from '@nestjs/common';
import { PetsService } from './pets.service';
import { PetsController } from './pets.controller';
import { EmailModule } from 'src/email/email.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LostPet } from 'src/core/db/entities/lost-pet.entity';
import { FoundPet } from 'src/core/db/entities/found-pet.entity';
import { CacheModule } from 'src/cache/cache.module';

@Module({
  imports: [
    EmailModule,
    TypeOrmModule.forFeature([LostPet, FoundPet]),
    CacheModule,
  ],
  providers: [PetsService],
  controllers: [PetsController],
})
export class PetsModule {}
