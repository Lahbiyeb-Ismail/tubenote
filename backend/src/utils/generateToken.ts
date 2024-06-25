import jwt from 'jsonwebtoken';

interface Payload {
  id: string;
  email: string;
}

const jwtSecret = process.env['JWT_SECRET'] as string;

function generateToken(payload: Payload, expiresIn: string) {
  return jwt.sign(payload, jwtSecret, {
    expiresIn,
  });
}

export default generateToken;
