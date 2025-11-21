import { Validators } from "../../../config";


export class CreateProductDTO {
    private constructor(
        public readonly name: string,
        public readonly price: number,
        public readonly description: string,
        public readonly user: string,
        public readonly available: boolean,
        public readonly category: string,
    ) {}

    static create( data: { [key: string]: any } ):[string?, CreateProductDTO?] {
        const { name, available, price, description, user, category } = data;

        if (!name) return [ 'Missing name' ];
        if (!price) return [ 'Missing price' ];
        if (!description) return [ 'Missing description' ];
        if (!user) return [ 'Missing user' ];

        if (Validators.isMongoId(user) === false) {
            return [ 'Invalid user id' ];
        }
        if (!category) return [ 'Missing category' ];
        if (Validators.isMongoId(category) === false) {
            return [ 'Invalid category id' ];
        }

        return [ undefined, new CreateProductDTO(name, price, description, user, !!available, category) ];
    }
}