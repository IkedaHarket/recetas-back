import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { CreateRecipeDto, UpdateRecipeDto } from './dto';
import { ApiTags } from '@nestjs/swagger';
import { Auth, GetUser } from 'src/auth/decorators';
import { AUTH_ROLES } from 'src/auth/interfaces';
import { User } from 'src/auth/entities';

@ApiTags('Recipes')
@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Auth(AUTH_ROLES.USER_ROLE)
  @Post()
  create(
    @Body() createRecipeDto: CreateRecipeDto,
    @GetUser() user: User,
    ) {
    return this.recipesService.create(createRecipeDto, user);
  }

  @Get()
  findAll() {
    return this.recipesService.findAll();
  }

  @Get(':term')
  find(@Param('term') term: string) {
    return this.recipesService.find(term);
  }

  @Auth(AUTH_ROLES.USER_ROLE)
  @Put(':id')
  update(
    @Param('id') id: string, 
    @Body() updateRecipeDto: UpdateRecipeDto,
    @GetUser() user: User,
    ) {
    return this.recipesService.update(id, updateRecipeDto, user);
  }

  @Auth(AUTH_ROLES.USER_ROLE)
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @GetUser() user: User,
    ) {
    return this.recipesService.remove(id, user);
  }
}
