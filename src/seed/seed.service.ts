import { Injectable, Logger } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {
  constructor(
    private readonly productsService: ProductsService
  ) { }

  async executeSeed() {
    if (await this.cleanDatabase()) {
      const products = initialData.products;

      const insertPromises = [];
      products.forEach(product => {
        insertPromises.push(this.productsService.create(product));
      });
      
      await Promise.all(insertPromises);

    }
    return 'Seed executed';
  }


  private async cleanDatabase() {
    let res: Boolean = false;
    try {
      await this.productsService.deleteAllProducts().then(() => res = true);
    } catch (error) {
      Logger.error(error)
    }

    return res;
  }
}
