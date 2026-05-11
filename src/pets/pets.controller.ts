import { Body, Controller, Get, Post } from '@nestjs/common';
import { PetsService } from './pets.service';
import type { LostPetDto } from 'src/core/interfaces/lost-pet.interface';
import type { FoundPetDto } from 'src/core/interfaces/found-pet.interface';

@Controller('pets')
export class PetsController {
  constructor(private readonly petService: PetsService) {}

  @Post('lost')
  async createLostPet(@Body() lostPet: LostPetDto) {
    const result = await this.petService.createLostPet(lostPet);
    return result;
  }

  @Post('found')
  async createFoundPet(@Body() foundPet: FoundPetDto) {
    const result = await this.petService.createFoundPet(foundPet);
    return result;
  }

  @Get('lost-pets')
  async getLostPets() {
    const result = await this.petService.getLostPets();
    return result;
  }

  @Get('found-pets')
  async getFoundPets() {
    const result = await this.petService.getFoundPets();
    return result;
  }
}
