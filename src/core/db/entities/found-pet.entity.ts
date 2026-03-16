import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import type { Point } from 'typeorm';

@Entity("found_pets")
export class FoundPet {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  species!: string;

  @Column()
  breed!: string;

  @Column()
  color!: string;

  @Column()
  size!: string;

  @Column({ type: "text" })
  description!: string;

  @Column({ nullable: true })
  photo_url!: string;

  @Column()
  finder_name!: string;

  @Column()
  finder_email!: string;

  @Column()
  finder_phone!: string;

  @Column({
    type: "geometry",
    spatialFeatureType: "Point",
    srid: 4326,
  })
  location!: Point;

  @Column()
  address!: string;

  @Column({ type: "timestamp" })
  found_date!: Date;

  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  created_at!: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  updated_at!: Date;
}