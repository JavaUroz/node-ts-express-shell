import { CategoryModel } from "../../data";
import { CreateCategoryDTO, CustomError, UserEntity, PaginationDto } from "../../domain";

export class CategoryService {
    //DI
    constructor(){}

    async createCategory(createCategoryDTO: CreateCategoryDTO, user: UserEntity) {

        const categoryExists = await CategoryModel.findOne({ name: createCategoryDTO.name });
        if ( categoryExists ) throw CustomError.badRequest(`Category ${ createCategoryDTO.name } already exists`);
        
        try {
            const category = new CategoryModel({
                ...createCategoryDTO,
                user: user.id,
            })

            await category.save();
            return {
                id: category.id,
                name: category.name,
                available: category.available,
            };
            
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getCategories(paginationDto: PaginationDto) {

    const { page, limit } = paginationDto;
    const skip = (page - 1) * limit;

    try {
        const [total, categories] = await Promise.all([
            CategoryModel.countDocuments(),
            CategoryModel.find().skip(skip).limit(limit)
        ]);        

        return {
            page,
            limit,
            total,
            next: page < total ? `/api/categories?page=${ page + 1 }&limit=${ limit }` : null,
            prev: page > 1 && page <= total ? `/api/categories?page=${ page - 1 }&limit=${ limit }` : null,
            categories: categories.map( category => ({
                id: category.id,
                name: category.name,
                available: category.available,
            }))
        };

    } catch (error) {
        throw CustomError.internalServer('Internal server error');
    }

}
}