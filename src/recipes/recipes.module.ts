import { Module } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { RecipesController } from './recipes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recipe } from './entities';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [RecipesController],
  providers: [RecipesService],
  imports: [
    TypeOrmModule.forFeature([ Recipe ]),
    AuthModule,
  ]
})
export class RecipesModule {}
