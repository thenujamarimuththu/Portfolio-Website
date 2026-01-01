import { Schema, model, models, Document, Types, Model } from 'mongoose';

export type UserRole = 'ADMIN' | 'USER';

export interface IUser {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  image?: string;
  emailVerified?: Date;
  phone?: string;
  address?: string;
  bio?: string;
  isActive?: boolean;
  lastLogin?: Date;
  authProvider?: string; 
  notificationPreferences?: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    inAppNotifications: boolean;
    appointmentReminders: boolean;
    messageAlerts: boolean;
    systemUpdates: boolean;
    marketingEmails: boolean;
  };
}

export interface IUserDocument extends IUser, Document {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  displayName: string;
  roleDisplayName: string;
  isActiveUser(): boolean;
  hasRole(role: UserRole | UserRole[]): boolean;
}

export interface IUserModel extends Model<IUserDocument> {
  findActiveUsers(): Promise<IUserDocument[]>;
  findByRole(role: UserRole): Promise<IUserDocument[]>;
  findByAuthProvider(provider: string): Promise<IUserDocument[]>;
}

const UserSchema = new Schema<IUserDocument, IUserModel>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
    },
    password: {
      type: String,
      minlength: 6,
      select: false, 
    },
    role: {
      type: String,
      enum: ['ADMIN', 'USER'],
      default: 'USER',
    },
    image: {
      type: String,
      trim: true,
    },
    emailVerified: {
      type: Date,
    },
    phone: {
      type: String,
      trim: true,
      match: /^\+?[\d\s-()]+$/,
    },
    address: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
    authProvider: {
      type: String,
      enum: ['credentials', 'google', 'github'],
      default: 'credentials',
    },
    notificationPreferences: {
      emailNotifications: { type: Boolean, default: true },
      pushNotifications: { type: Boolean, default: true },
      inAppNotifications: { type: Boolean, default: true },
      appointmentReminders: { type: Boolean, default: true },
      messageAlerts: { type: Boolean, default: true },
      systemUpdates: { type: Boolean, default: true },
      marketingEmails: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better query performance
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ isActive: 1 });
UserSchema.index({ authProvider: 1 });
UserSchema.index({ createdAt: -1 });

// Compound index for common queries
UserSchema.index({ email: 1, isActive: 1 });
UserSchema.index({ role: 1, isActive: 1 });

// Virtual properties
UserSchema.virtual('displayName').get(function () {
  return this.name;
});

UserSchema.virtual('roleDisplayName').get(function () {
  return this.role === 'ADMIN' ? 'Administrator' : 'User';
});

// Instance Methods
UserSchema.methods.isActiveUser = function (): boolean {
  return this.isActive === true && !!this.emailVerified;
};

UserSchema.methods.hasRole = function (
  role: UserRole | UserRole[]
): boolean {
  return Array.isArray(role)
    ? role.includes(this.role)
    : this.role === role;
};

// Static Methods
UserSchema.statics.findActiveUsers = function (): Promise<IUserDocument[]> {
  return this.find({ isActive: true, emailVerified: { $exists: true } });
};

UserSchema.statics.findByRole = function (role: UserRole): Promise<IUserDocument[]> {
  return this.find({ role });
};

UserSchema.statics.findByAuthProvider = function (provider: string): Promise<IUserDocument[]> {
  return this.find({ authProvider: provider });
};

// Pre-save middleware
UserSchema.pre('save', async function () {
  // Ensure email is lowercase
  if (this.isModified('email')) {
    this.email = this.email.toLowerCase().trim();
  }
});

const User =
  models.User || model<IUserDocument, IUserModel>('User', UserSchema);

export default User;