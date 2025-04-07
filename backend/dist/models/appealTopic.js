import { prismaAppeal } from './prisma.js';
/**
 * получение спписка тем
 * @param prisma
 * @returns
 */
export async function getAppealTopics(prisma = prismaAppeal) {
    try {
        await prisma.$connect();
        const data = await prisma.appealTopic.findMany();
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
/**
 * добавление темы
 * @param prisma
 * @param topicData
 * @returns
 */
export async function createAppealTopic(topicData, prisma = prismaAppeal) {
    try {
        await prisma.$connect();
        const newTopic = await prisma.appealTopic.create({
            data: topicData,
        });
        return newTopic;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
    finally {
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
export async function updateAppealTopic(id, updateData, prisma = prismaAppeal) {
    try {
        await prisma.$connect();
        const updated = await prisma.appealTopic.update({
            where: { appeal_topic_id: id },
            data: updateData,
        });
        return updated;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
    finally {
        await prisma.$disconnect();
    }
}
/**
 * удаление темы
 * @param id
 * @param prisma
 * @returns
 */
export async function deleteAppealTopic(id, prisma = prismaAppeal) {
    try {
        await prisma.$connect();
        const deleted = await prisma.appealTopic.delete({
            where: { appeal_topic_id: id },
        });
        return deleted;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
    finally {
        await prisma.$disconnect();
    }
}
