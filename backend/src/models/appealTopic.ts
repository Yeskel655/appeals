import { AppealTopic, PrismaClient } from '@prisma/client';
import { prismaAppeal } from './prisma.js';

type IDataCU = { title?: string; description?: string }

/**
 * получение спписка тем
 * @param prisma
 * @returns
 */
export async function getAppealTopics(
    prisma: PrismaClient = prismaAppeal): Promise<AppealTopic[]> {
    try {
        await prisma.$connect();

        const data = await prisma.appealTopic.findMany()

        return data
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}
/**
 * добавление темы
 * @param prisma
 * @param topicData
 * @returns
 */
export async function createAppealTopic(
    topicData: IDataCU,
    prisma: PrismaClient = prismaAppeal
): Promise<AppealTopic> {
    try {
        await prisma.$connect();
        const newTopic = await prisma.appealTopic.create({
            data: topicData,
        });
        return newTopic;
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}
/**
 * обновление темы
 * @param id
 * @param updateData
 * @param prisma
 * @returns
 */
export async function updateAppealTopic(
    id: number,
    updateData: IDataCU,
    prisma: PrismaClient = prismaAppeal
): Promise<AppealTopic | null> {
    try {
        await prisma.$connect();
        const updated = await prisma.appealTopic.update({
            where: { appealTopicId: id },
            data: updateData,
        });
        return updated;
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}
/**
 * удаление темы
 * @param id
 * @param prisma
 * @returns
 */
export async function deleteAppealTopic(
    id: number,
    prisma: PrismaClient = prismaAppeal,
): Promise<AppealTopic> {
    try {
        await prisma.$connect();
        const deleted = await prisma.appealTopic.delete({
            where: { appealTopicId: id },
        });
        return deleted;
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}


