import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from ".";
import { User } from "src/auth/entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity({ name: 'products' })
export class Product {
    @ApiProperty({
        type: 'string',
        format: 'uuid',
        example: '9e7a7f8a-9e7a-4e7a-9e7a-9e7a7f8a7f8a',
        description: 'Product ID',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: 'T-Shirt Teslo',
        description: 'Product title',
        uniqueItems: true
    })
    @Column('text', { unique: true })
    title: string;

    @ApiProperty({
        example: 0,
        description: 'Product price',
    })
    @Column('float', { default: 0 })
    price: number;

    @ApiProperty({
        example: 'Product description',
        description: 'Product description',
    })
    @Column('text', { nullable: true, })
    description: string;

    @ApiProperty({
        example: 't_shirt_teslo',
        description: 'Product slug',
        uniqueItems: true
    })
    @Column('text', { unique: true })
    slug: string;

    @ApiProperty({
        example: 0,
        description: 'Product stock',
    })
    @Column('int', { default: 0 })
    stock: number;

    @ApiProperty({
        example: ['M', 'XL', 'XXL'],
        description: 'Product sizes',
        isArray: true
    })
    @Column('text', { array: true })
    sizes: string[];

    @ApiProperty({
        example: 'men',
        description: 'Product gender',
    })
    @Column('text')
    gender: string;

    @ApiProperty({
        example: ['product1', 'product2'],
        description: 'Product tags',
        isArray: true
    })
    @Column('text', { array: true, default: [] })
    tags: string[];

    @ApiProperty({
        example: ['t_shirt_teslo.jpg', 't_shirt_teslo2.jpg'],
        description: 'Product images',
        isArray: true
    })
    @OneToMany(
        () => ProductImage,
        (productImage) => productImage.product,
        { cascade: true, eager: true }
    )
    images?: ProductImage[];

    @ManyToOne(
        () => User,
        (user) => user.product,
        { eager: true }
    )
    user: User

    @BeforeInsert()
    checkSlug() {
        if (!this.slug) {
            this.slug = this.title.toLowerCase().replaceAll(' ', '_').replaceAll("'", '');
        } else {
            this.slug = this.slug.toLowerCase().replaceAll(' ', '_').replaceAll("'", '');
        }
    }

    @BeforeUpdate()
    checkSlugUpdate() {
        this.slug = this.slug.toLowerCase().replaceAll(' ', '_').replaceAll("'", '');
    }
}
