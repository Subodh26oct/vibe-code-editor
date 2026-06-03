import { UserRole, Template } from "@prisma/client";
import NextAuth , {type DefaultSession} from "next-auth"


export type ExtendedUser = DefaultSession["user"] & {
    role:UserRole
    accessToken?:string
}

declare module "next-auth"{
    interface Session{
        user:ExtendedUser
    }
}

import {JWT} from "next-auth/jwt";


declare module "next-auth/jwt"{
    interface JWT{
        role:UserRole;
        accessToken?:string;
    }
}