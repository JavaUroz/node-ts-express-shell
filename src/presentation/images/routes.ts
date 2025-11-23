import { Router } from 'express';
import { ImageController } from './controller';


export class ImageRoutes {
    static get routes(): Router {
        const router = Router();

        const image = new ImageController

        router.get('/:type/:img', image.getImage);

        return router;
    }
}