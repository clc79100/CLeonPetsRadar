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

@Injectable()
export class PetsService {
    constructor(
        @InjectRepository(LostPet)
        private readonly lostPetRepository: Repository<LostPet>,

        @InjectRepository(FoundPet)
        private readonly foundPetRespository: Repository<FoundPet>,
        private readonly emailService: EmailService
    ) { }

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
                type: "Point",
                coordinates: [lostPet.lon, lostPet.lat],
            }
        });
        await this.lostPetRepository.save(newlostPetEntity);
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
                type: "Point",
                coordinates: [foundPet.lon, foundPet.lat],
            }
        });
        await this.foundPetRespository.save(newFounPet);

        const lostPets = await this.getLostPetsByRadius(foundPet.lat, foundPet.lon, 500)
        const template = generateLostPetEmailTemplate(foundPet, lostPets);
        const options: EmailOptions = {
            to: envs.TEST_EMAIL,
            subject: `Se encontro una mascota cerca de ${foundPet.address}`,
            html: template
        };
        const result = await this.emailService.sendEmail(options);
        return result;

    }

    async getLostPetsByRadius(lat: number, lon: number, radius: number): Promise<LostPet[]> {
        try {
            console.log(`Buscando incidentes en ${lat} ${lon} en un radio de ${radius} mts`);
            const lostPets = await this.lostPetRepository
                .createQueryBuilder('lost_pets')
                .addSelect(`
                  ST_Distance(
                    lost_pets.location::geography,
                    ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)::geography
                  )
                `, 'distance')
                              .where('lost_pets.is_active = true')
                              .andWhere(`
                  ST_DWithin(
                    lost_pets.location::geography,
                    ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)::geography,
                    :radius
                  )
                `)
                .orderBy('distance', 'ASC')
                .setParameters({ lon, lat, radius })
                .getMany();
            console.log(`Se encontraron ${lostPets.length} en un radio de ${radius} mts`);
            return lostPets;
        } catch (error) {
            console.error(error)
            return [];
        }
    }
}