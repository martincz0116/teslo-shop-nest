import { Injectable, Logger } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';
import { User } from 'src/auth/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'

@Injectable()
export class SeedService {
  constructor(
    private readonly productsService: ProductsService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) { }

  async executeSeed() {
    if (await this.cleanDatabase()) {
      const user = await this.insertUsers();
      await this.insertProducts(user);
    }
    return 'Seed executed';
  }

  private async insertProducts(user: User) {
    const products = initialData.products;
    const insertPromises = [];
    products.forEach(product => {
      insertPromises.push(this.productsService.create(product, user));
    });

    await Promise.all(insertPromises);
  }

  private async insertUsers(): Promise<User> {
    const seedUsers = initialData.users;
    const users: User[] = [];

    seedUsers.forEach(user => {
      users.push(this.userRepository.create({ ...user, password: bcrypt.hashSync(user.password, 10) }));
    });

    const dbusers = await this.userRepository.save(users);

    return dbusers[0];
  }

  private async cleanDatabase() {
    let res: Boolean = false;
    try {
      await this.productsService.deleteAllProducts();
      const queryBuilder = this.userRepository.createQueryBuilder('user');
      await queryBuilder.delete().where({}).execute();
      res = true
    } catch (error) {
      Logger.error(error)
    }

    return res;
  }
}
