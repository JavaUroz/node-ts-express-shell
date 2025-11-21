import { ProductModel } from "../../data";
import { CreateProductDTO, CustomError, PaginationDto } from "../../domain";

export class ProductService {
    //DI
    constructor(){}

    async createProduct(createProductDTO: CreateProductDTO) {

        const productExists = await ProductModel.findOne({ name: createProductDTO.name });
        if ( productExists ) throw CustomError.badRequest(`Product ${ createProductDTO.name } already exists`);
        
        try {
            const product = new ProductModel({
                ...createProductDTO,
            })

            await product.save();
            return product;
            
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getProducts(paginationDto: PaginationDto) {

        const { page, limit } = paginationDto;
        const skip = (page - 1) * limit;

        try {
            const [total, products] = await Promise.all([
                ProductModel.countDocuments(),
                ProductModel.find().skip(skip).limit(limit).populate('category').populate('user')
            ]);        

            return {
                page,
                limit,
                total,
                next: page < total ? `/api/products?page=${ page + 1 }&limit=${ limit }` : null,
                prev: page > 1 && page <= total ? `/api/products?page=${ page - 1 }&limit=${ limit }` : null,
                products: products
            };

        } catch (error) {
            throw CustomError.internalServer('Internal server error');
        }
    }
}