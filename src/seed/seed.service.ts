import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { lastValueFrom } from 'rxjs';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { PokeAPIResponse } from './interfaces/pokeAPI.interfaces';

@Injectable()
export class SeedService {
  constructor(
    private httpService: HttpService,

    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
  ) {}

  async populateDB() {
    await this.pokemonModel.deleteMany({});

    const url = 'https://pokeapi.co/api/v2/pokemon?limit=60';

    try {
      const response = await lastValueFrom(
        this.httpService.get<PokeAPIResponse>(url),
      );

      const pokemons = response.data.results.map(({ name, url }) => ({
        name,
        position: Number(url.split('/').slice(-2, -1)[0]),
      }));

      await this.pokemonModel.insertMany(pokemons);

      return 'Database populated successfully';
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error fetching data:', error.message);
      } else {
        console.error('Error fetching data:', error);
      }
      throw new Error('Failed to populate the database');
    }
  }
}
