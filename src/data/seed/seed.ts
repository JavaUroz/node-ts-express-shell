import { envs } from "../../config/envs";
import { CategoryModel, MongoDatabase, ProductModel, UserModel } from "../mongo";
import { seedData } from "./data";


(async () => {
    await MongoDatabase.connect({
        dbName: envs.MONGO_DB_NAME,
        mongoUrl: envs.MONGO_URL,
    })

    await main();

    await MongoDatabase.disconnect();

})();

const randomNumber = ( max: number ) => Math.floor( Math.random() * max );

async function main() {

    //0. limpiar la base de datos
    await Promise.all([
        UserModel.deleteMany(),
        CategoryModel.deleteMany(),
        ProductModel.deleteMany(),
    ]);

    //1. crear usuarios
    const users = await UserModel.insertMany(seedData.users);

    //2. crear categorias
    const categories = await CategoryModel.insertMany(seedData.categories
        .map( (category) => ({
            ...category,
            user: users[randomNumber(users.length)].id
        }))
    );
    //3. crear productos
    const products = await ProductModel.insertMany(seedData.products
        .map( (product) => ({
            ...product,
            user: users[ randomNumber(users.length)].id,
            category: categories[randomNumber(categories.length)].id, 
        }))
    );

    console.log('Seeding completed');
}