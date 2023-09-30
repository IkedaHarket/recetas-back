import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Recipe } from './entities';
import { DataSource, Repository } from 'typeorm';
import { validate as isUUID } from 'uuid';
import { User } from 'src/auth/entities';

@Injectable()
export class RecipesService {

  constructor(
    @InjectRepository(Recipe)
    private readonly recipeRepository: Repository<Recipe>,
    private readonly datasource: DataSource,
  ){}

  async create(createRecipeDto: CreateRecipeDto, user: User) {
    
    try {
      const recipe = this.recipeRepository.create( { user, ...createRecipeDto} )

      await this.recipeRepository.save(recipe)

      return recipe 

    } catch (error) {
      this.handleDBErrors(error)
    }
  }

  async findAll() {
    try {
      return await this.recipeRepository.findBy({ isActive: true })
    } catch (error) {
      this.handleDBErrors(error)
    }
  }

  async find(term: string) :Promise<Recipe[]> {
    let recipes: Recipe[] = [];

    if ( isUUID(term) ) {
      recipes.push( await this.recipeRepository.findOneBy({ id: term }) ) 
    } else {
      const queryBuilder = this.recipeRepository.createQueryBuilder('recipe'); 
      recipes = await queryBuilder
        .where('UPPER(name) LIKE :name AND "isActive" = true', {
          name: `%${term.toUpperCase()}%`,
        })
        .getMany();
    } 
    
    if ( !recipes ) 
      throw new NotFoundException(`Receta con termino ${ term } no encontrada`);

    return recipes;
  }

  async update(id: string, updateRecipeDto: UpdateRecipeDto, user: User) {

    const oldRecipe = await this.find(id);
    const recipe = await this.recipeRepository.preload({ id, ...updateRecipeDto})
    
    if(oldRecipe[0].user.id !== user.id) throw new ForbiddenException('No tienes permiso de realizar esta accion')

    if(!recipe) throw new NotFoundException(`No se encontro receta con el id ${id}`)

    const queryRunner = this.datasource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction();

    try {

      await queryRunner.manager.save(recipe)
      await queryRunner.commitTransaction()
      await queryRunner.release()

      return recipe

    } catch (error) {
      this.handleDBErrors(error)
    }
  }

  async remove(recipeId: string, user: User) {
    const recipe = await this.find( recipeId )
    if(recipe[0].user.id !== user.id) throw new ForbiddenException('No tienes permiso de realizar esta accion')

    await this.recipeRepository.update({ id: recipeId }, { ...recipe[0], isActive: false } )

  }

  private handleDBErrors(error:any): never {
    if(error.code === '23505') throw new BadRequestException(error.detail)
    console.log(error);
    throw new InternalServerErrorException('Please check server logs')
  }
}
