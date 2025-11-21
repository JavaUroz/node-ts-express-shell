import {NextFunction, Response, Request} from 'express';
import { JwtAdapter } from '../../config';
import { UserModel } from '../../data';
import { UserEntity } from '../../domain';

export class AuthMiddleware {
  
  static async validateJWT(req: Request, res: Response, next: NextFunction) {

    const authHeader = req.headers['authorization'];
      if (!authHeader) return res.status(401).json({ error: 'No token provided' });
      if (!authHeader.startsWith('Bearer ')) return res.status(401).json({ error: 'Invalid bearer token format' });

      const token = authHeader.split(' ').at(1) || '';

      try {
        const payload = await JwtAdapter.validateToken<{ id: string }>(token);
        if(!payload) return res.status(401).json({ error: 'Invalid or expired token' });

        const user = await UserModel.findById(payload.id);
        if (!user) return res.status(401).json({ error: 'Invalid token - user' });

        //TODO: Verificar si el user está activo

        req.body.user = UserEntity.fromObject(user);

        next();

      } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
      }
    }
}