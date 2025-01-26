import { Schema, model, Document } from 'mongoose';

interface IUser extends Document {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  password_hash: string;
  isActive: boolean;
  age: number;
}

const userSchema = new Schema<IUser>({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  age: { type: Number, required: true, min: 18 }
});

const UserModel = model<IUser>('User', userSchema);

export { UserModel, IUser };
