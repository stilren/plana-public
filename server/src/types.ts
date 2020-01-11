import { Prisma } from './generated/prisma-client'

export interface Context {
  prisma: Prisma
  currentUser: CurrentUser
}

export interface CurrentUser {
    id: string
    email: string
    households: string[]
}