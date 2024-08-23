import mongoose from "mongoose";
import { Roles_permissions } from "../../src/assets/enums/Roles_permissions.js";

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: [true, "name is required"],
      trim: true,
      required: true,
      minLength: [1, "too short category name"],
    },
    description: {
      type: String,
      trim: true,
    },
    roles: [
      {
        collection: {
          type: String,
          unique: [true, "name is required"],
          trim: true,
          required: true,
          minLength: [1, "too short category name"],
        },
        permissions: [
          {
            type: String,
            enum: Object.values(Roles_permissions),
            default: Roles_permissions.read,
          },
        ],
      },
    ],
    createdBy: { type: mongoose.Types.ObjectId, ref: "user" },
  },
  { timestamps: true }
);

export const UserRoleModel = mongoose.model("user_roles", schema);
