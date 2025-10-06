// 代码生成时间: 2025-10-07 00:00:15
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SearchAutocompleteEntity } from './search-autocomplete.entity';

@Injectable()
export class AutocompleteService {
  constructor(
    @InjectRepository(SearchAutocompleteEntity)
    private readonly searchAutocompleteRepository: Repository<SearchAutocompleteEntity>,
  ) {}

  // Find suggestions based on a given prefix
  async findSuggestions(prefix: string): Promise<SearchAutocompleteEntity[]> {
    if (!prefix) {
      throw new Error('Prefix is required for autocomplete search.');
    }

    try {
      const suggestions = await this.searchAutocompleteRepository.find({
        where: {
          name: Like(`%${prefix}%`),
        },
        take: 10, // Limit the number of suggestions
      });
      return suggestions;
    } catch (error) {
      throw new Error(`Error fetching suggestions: ${error.message}`);
    }
  }
}

/*
 * SearchAutocompleteEntity
 * Entity representing the search autocomplete data.
 */
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class SearchAutocompleteEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
