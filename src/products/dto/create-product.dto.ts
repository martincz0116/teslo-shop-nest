import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsIn, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";

export class CreateProductDto {
    @ApiProperty({
        description: 'Product title',
        nullable: false,
        minLength: 1
    })
    @IsString()
    @MinLength(1)
    title: string;

    @ApiProperty({
        description: 'Product description',
        nullable: true,
    })
    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?: number;

    @ApiProperty({
        description: 'Product description',
        nullable: true,
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({
        description: 'Product slug',
        nullable: true,
    })
    @IsString()
    @IsOptional()
    slug?: string;

    @ApiProperty({
        description: 'Product stock',
        nullable: true,
    })
    @IsNumber()
    @IsPositive()
    @IsOptional()
    stock?: number;

    @ApiProperty({
        description: 'Product sizes',
        nullable: true,
    })
    @IsString({ each: true })
    @IsArray()
    sizes: string[];

    @ApiProperty({
        description: 'Product type',
        nullable: true,
        enum: ['men', 'women', 'kid', 'unisex'],
    })
    @IsIn(['men', 'women', 'kid', 'unisex'])
    gender: string;

    @ApiProperty({
        description: 'Product tags',
        nullable: true,
    })
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    tags?: string[];

    @ApiProperty({
        description: 'Product images',
        nullable: true,
    })
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    images?: string[]
}
