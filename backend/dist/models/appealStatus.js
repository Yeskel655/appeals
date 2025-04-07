import { prismaAppeal } from './prisma.js';
/**
 * получение списка статусов обращения
 * @param prisma
 * @returns
 */
export async function getAppealStatues(prisma = prismaAppeal) {
    try {
        await prisma.$connect();
        const data = await prisma.statusAppeal.findMany();
        return data;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
    finally {
        await prisma.$disconnect();
    }
}
