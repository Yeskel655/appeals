import { AppealStatus, PrismaClient, } from '@prisma/client';
import { prismaAppeal } from './prisma.js';

/**
 * получение списка статусов обращения
 * @param prisma
 * @returns
 */
export async function getAppealStatues(
    prisma: PrismaClient = prismaAppeal): Promise<AppealStatus[]> {
    try {
        await prisma.$connect();

        const data = await prisma.appealStatus.findMany()

        return data
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}