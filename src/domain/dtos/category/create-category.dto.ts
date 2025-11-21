

export class CreateCategoryDTO {
    private constructor(
        public readonly name: string,
        public readonly available: boolean,
    ) {}

    static create( data: { [key: string]: any } ):[string?, CreateCategoryDTO?] {
        const { name, available } = data;
        let availableParsed = available;

        if (!name) return [ 'Missing name' ];

        if (typeof available !== 'boolean') {
            availableParsed = (available === 'true');            
        };

        return [ undefined, new CreateCategoryDTO(name, available) ];
    }
}