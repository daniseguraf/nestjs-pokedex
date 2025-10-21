import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { isMongoId, isString } from 'class-validator';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name) private readonly pokemonModel: Model<Pokemon>,
  ) {}

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();

    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error: any) {
      this.handleExceptions(error);
    }
  }

  findAll() {
    return `This action returns all pokemon`;
  }

  async findOne(term: string) {
    let pokemon: Pokemon | null = null;

    // Get by position
    if (!isNaN(Number(term))) {
      pokemon = await this.pokemonModel.findOne({
        position: Number(term),
      });
    }

    // Get by MongoID
    if (isMongoId(term)) {
      pokemon = await this.pokemonModel.findById(term);
    }

    // Get by name
    if (!isMongoId(term) && isString(term)) {
      pokemon = await this.pokemonModel.findOne({
        name: term.toLowerCase(),
      });
    }

    if (!pokemon) {
      throw new NotFoundException(
        `Pokemon with id, name or no "${term}" not found`,
      );
    }
  }

  async update(id: string, updatePokemonDto: UpdatePokemonDto) {
    try {
      const updatedPokemon = await this.pokemonModel.findByIdAndUpdate(
        id,
        {
          $set: {
            ...updatePokemonDto,
            name: updatePokemonDto.name?.toLowerCase(),
          },
        },
        { new: true },
      );

      return updatedPokemon;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const removedPokemon = await this.pokemonModel.findByIdAndDelete(id);

    if (!removedPokemon) {
      throw new NotFoundException(`Pokemon with id "${id}" not found`);
    }

    return;
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Pokemon exists in db ${JSON.stringify(error.keyValue)}`,
      );
    }

    console.log(error);
    throw new InternalServerErrorException(
      `Can't create Pokemon - Check server logs`,
    );
  }
}
