import { InjectRepository } from '@nestjs/typeorm';
import { LostPet } from 'src/core/db/entities/lost-pet.entity';
import { FoundPet } from 'src/core/db/entities/found-pet.entity';
import { Repository } from 'typeorm';
import { EmailService } from 'src/email/email.service';
import { Injectable } from '@nestjs/common';
import { LostPetDto } from 'src/core/interfaces/lost-pet.interface';
import { generateLostPetEmailTemplate } from './templates/lost-pet-email.template';
import { EmailOptions } from 'src/core/interfaces/mail-options.interface';
import { envs } from 'src/config/envs';
import { FoundPetDto } from 'src/core/interfaces/found-pet.interface';
import { CacheService } from 'src/cache/cache.service';
import { logger } from 'src/config/logger';

const CACHE_KEY_ALL_FOUND_PETS = 'found-pets:all';
const CACHE_KEY_ALL_LOST_PETS = 'lost-pets:all';

@Injectable()
export class PetsService {
  constructor(
    @InjectRepository(LostPet)
    private readonly lostPetRepository: Repository<LostPet>,

    @InjectRepository(FoundPet)
    private readonly foundPetRespository: Repository<FoundPet>,
    private readonly emailService: EmailService,
    private readonly cachceService: CacheService,
  ) {}

  async createLostPet(lostPet: LostPetDto): Promise<Boolean> {
    const newlostPetEntity = this.lostPetRepository.create({
      name: lostPet.name,
      species: lostPet.species,
      breed: lostPet.breed,
      color: lostPet.color,
      size: lostPet.size,
      description: lostPet.description,
      photo_url: lostPet.photo_url,
      owner_name: lostPet.owner_name,
      owner_email: lostPet.owner_email,
      owner_phone: lostPet.owner_phone,
      address: lostPet.address,
      lost_date: lostPet.lost_date,
      is_active: lostPet.is_active ?? true,
      location: {
        type: 'Point',
        coordinates: [lostPet.lon, lostPet.lat],
      },
    });
    await this.lostPetRepository.save(newlostPetEntity);
    await this.cachceService.delete(CACHE_KEY_ALL_LOST_PETS);
    return true;
  }

  async createFoundPet(foundPet: FoundPetDto): Promise<Boolean> {
    const newFounPet = this.foundPetRespository.create({
      species: foundPet.species,
      breed: foundPet.breed,
      color: foundPet.color,
      size: foundPet.size,
      description: foundPet.description,
      photo_url: foundPet.photo_url,
      finder_name: foundPet.finder_name,
      finder_email: foundPet.finder_email,
      finder_phone: foundPet.finder_phone,
      address: foundPet.address,
      found_date: foundPet.found_date,
      location: {
        type: 'Point',
        coordinates: [foundPet.lon, foundPet.lat],
      },
    });
    await this.foundPetRespository.save(newFounPet);
    await this.cachceService.delete(CACHE_KEY_ALL_FOUND_PETS);

    const lostPets = await this.getLostPetsByRadius(
      foundPet.lat,
      foundPet.lon,
      500,
    );
    const template = generateLostPetEmailTemplate(foundPet, lostPets);
    const options: EmailOptions = {
      to: envs.TEST_EMAIL,
      subject: `Se encontro una mascota cerca de ${foundPet.address}`,
      html: template,
    };
    const result = await this.emailService.sendEmail(options);
    return result;
  }

  async getLostPetsByRadius(
    lat: number,
    lon: number,
    radius: number,
  ): Promise<LostPet[]> {
    try {
      console.log(
        `Buscando incidentes en ${lat} ${lon} en un radio de ${radius} mts`,
      );
      const lostPets = await this.lostPetRepository
        .createQueryBuilder('lost_pets')
        .addSelect(
          `
                  ST_Distance(
                    lost_pets.location::geography,
                    ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)::geography
                  )
                `,
          'distance',
        )
        .where('lost_pets.is_active = true')
        .andWhere(
          `
                  ST_DWithin(
                    lost_pets.location::geography,
                    ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)::geography,
                    :radius
                  )
                `,
        )
        .orderBy('distance', 'ASC')
        .setParameters({ lon, lat, radius })
        .getMany();
      console.log(
        `Se encontraron ${lostPets.length} en un radio de ${radius} mts`,
      );
      return lostPets;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async getLostPets() {
    try {
      const data = await this.cachceService.get<LostPet[]>(
        CACHE_KEY_ALL_LOST_PETS,
      );

      if (data && data.length > 0) {
        logger.info('[PetService] Mascotas perdidas en cache');
        return data;
      }
      logger.info('[PetService] Trayendo todas las mascotas perdidas...');
      const lostPets = await this.lostPetRepository.find();
      logger.info('[PetService] Guardando mascotas perdidas en cache');
      await this.cachceService.set(CACHE_KEY_ALL_LOST_PETS, lostPets);
      logger.info(
        `[PetService] Se obtuvieron ${lostPets.length} mascotas perdidas`,
      );
      return lostPets;
    } catch (error) {
      console.error('[PetService] Error al traer las masctoas perdidas');
      console.error(error);
      return [];
    }
  }

  async getFoundPets() {
    try {
      const data = await this.cachceService.get<FoundPet[]>(
        CACHE_KEY_ALL_FOUND_PETS,
      );

      if (data && data.length > 0) {
        logger.info('[PetService] Mascotas encontradas en cache');
        return data;
      }
      logger.info('[PetService] Trayendo todas las mascotas encontradas...');
      const foundPets = await this.foundPetRespository.find();
      logger.info('[PetService] Guardando mascotas encontradas en cache');
      await this.cachceService.set(CACHE_KEY_ALL_FOUND_PETS, foundPets);
      logger.info(
        `[PetService] Se obtuvieron ${foundPets.length} mascotas encontradas`,
      );
      return foundPets;
    } catch (error) {
      console.error('[PetService] Error al traer las masctoas encontradas');
      console.error(error);
      return [];
    }
  }
}
