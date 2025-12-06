import { Request, Response } from 'express';
import User, { IUser } from '../models/User';
import Vendor from '../models/Vendor';
import { signAccessToken, signRefreshToken, verifyRefreshToken, hashPassword, comparePassword } from '../utils/jwt';

export const registerVendor = async (req: any, res: Response) => {
  try {
    const { vendorName, slug, firstName, lastName, email, password } = req.body;

    const vendor = await Vendor.create({
      name: vendorName,
      slug,
      contactEmail: email
    });

    const passwordHash = await hashPassword(password);
    const user = await User.create({
      firstName,
      lastName,
      email,
      passwordHash,
      role: 'VENDOR_ADMIN',
      vendorId: vendor._id
    });

    (res as any).status(201).json({ message: 'Vendor registered successfully', vendorId: vendor._id });
  } catch (error: any) {
    (res as any).status(500).json({ message: error.message });
  }
};

export const login = async (req: any, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }) as IUser;

    if (!user || !(await comparePassword(password, user.passwordHash))) {
      return (res as any).status(401).json({ message: 'Invalid credentials' });
    }

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    (res as any).cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    (res as any).json({ 
      accessToken, 
      user: { 
        id: user._id, 
        email: user.email, 
        role: user.role, 
        vendorId: user.vendorId 
      } 
    });
  } catch (error: any) {
    (res as any).status(500).json({ message: error.message });
  }
};

export const refreshToken = async (req: any, res: Response) => {
  const token = (req as any).cookies?.refreshToken;
  if (!token) return (res as any).status(401).json({ message: 'No refresh token' });

  try {
    const decoded: any = verifyRefreshToken(token);
    const user = await User.findById(decoded.userId) as IUser;
    
    if (!user) return (res as any).status(403).json({ message: 'User not found' });

    const newAccessToken = signAccessToken(user);
    (res as any).json({ accessToken: newAccessToken });
  } catch (error) {
    (res as any).status(403).json({ message: 'Invalid refresh token' });
  }
};

export const logout = (req: any, res: Response) => {
  (res as any).clearCookie('refreshToken');
  (res as any).json({ message: 'Logged out' });
};