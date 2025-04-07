import { prismaAppeal } from './prisma.js';
/**
 * получение обращений
 * @param prisma
 * @returns
 */
export async function getAppeals(prisma = prismaAppeal) {
    try {
        await prisma.$connect();
        const data = await prisma.appeal.findMany({
            include: { appeal_topic: true, status_appeal: true, appeal_message: true },
        });
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
 * создание обращения
 * @param prisma
 * @returns
 */
export async function createAppeal(appealData, prisma = prismaAppeal) {
    try {
        await prisma.$connect();
        const { topicId, message } = appealData;
        const status = await prisma.statusAppeal.findFirst({
            where: { status_appeal_cypher: 'NEW' },
        });
        if (!status) {
            throw new Error("Статус 'NEW' не найден");
        }
        const result = await prisma.$transaction(async (tx) => {
            const createdAppeal = await tx.appeal.create({
                data: {
                    appeal_topic_id: topicId,
                    status_appeal_id: status.status_appeal_id,
                },
            });
            const createdMessage = await tx.appealMessage.create({
                data: {
                    appeal_id: createdAppeal.appeal_id,
                    status_appeal_id: status.status_appeal_id,
                    appeal_message: message,
                },
            });
            await tx.appeal.update({
                where: { appeal_id: createdAppeal.appeal_id },
                data: { appeal_message_id: createdMessage.appeal_message_id },
            });
            return createdAppeal;
        });
        return result;
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
 * перевод обращение в статус в работе
 * @param prisma
 * @returns
 */
export async function appealToWork(id, prisma = prismaAppeal) {
    try {
        await prisma.$connect();
        const status = await prisma.statusAppeal.findFirst({ where: { status_appeal_cypher: 'WORK' } });
        if (!status) {
            throw new Error("Статус 'WORK' не найден");
        }
        const updated = await prisma.appeal.update({ where: { appeal_id: id }, data: { status_appeal_id: status?.status_appeal_id } });
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
 * перевод обращение в статус "Завершено"
 * @param prisma
 * @returns
 */
export async function appealToComplete(id, resolution, prisma = prismaAppeal) {
    try {
        await prisma.$connect();
        const status = await prisma.statusAppeal.findFirst({ where: { status_appeal_cypher: 'COMPLETED' } });
        if (!status) {
            throw new Error("Статус 'COMPLETED' не найден");
        }
        const [updatedAppeal, createdMessage] = await prisma.$transaction([
            prisma.appeal.update({
                where: { appeal_id: id },
                data: { status_appeal_id: status?.status_appeal_id },
            }),
            prisma.appealMessage.create({
                data: {
                    appeal_id: id,
                    status_appeal_id: status?.status_appeal_id,
                    appeal_message: resolution,
                },
            }),
        ]);
        return updatedAppeal;
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
 * перевод обращение в статус "Отменено"
 * @param prisma
 * @returns
 */
export async function appealToCancel(id, reason, prisma = prismaAppeal) {
    try {
        await prisma.$connect();
        const status = await prisma.statusAppeal.findFirst({ where: { status_appeal_cypher: 'CANCELLED' } });
        if (!status) {
            throw new Error("Статус 'CANCELLED' не найден");
        }
        const [updatedAppeal, createdMessage] = await prisma.$transaction([
            prisma.appeal.update({
                where: { appeal_id: id },
                data: { status_appeal_id: status?.status_appeal_id },
            }),
            prisma.appealMessage.create({
                data: {
                    appeal_id: id,
                    status_appeal_id: status?.status_appeal_id,
                    appeal_message: reason,
                },
            }),
        ]);
        return updatedAppeal;
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
 * перевод обращение в статус "Отменено" всех обращений
 * @param prisma
 * @returns
 */
export async function appealToCancelAllWork(prisma = prismaAppeal) {
    try {
        await prisma.$connect();
        const inProgress = await prisma.statusAppeal.findFirst({ where: { status_appeal_cypher: 'WORK' } });
        if (!inProgress) {
            throw new Error("Статус 'WORK' не найден");
        }
        const cancelled = await prisma.statusAppeal.findFirst({ where: { status_appeal_cypher: 'CANCELLED' } });
        if (!cancelled) {
            throw new Error("Статус 'CANCELLED' не найден");
        }
        const appeals = await prisma.appeal.findMany({
            where: { status_appeal_id: inProgress?.status_appeal_id },
        });
        const operations = appeals.flatMap((appeal) => [
            prisma.appeal.update({
                where: { appeal_id: appeal.appeal_id },
                data: { status_appeal_id: cancelled?.status_appeal_id },
            }),
            prisma.appealMessage.create({
                data: {
                    appeal_id: appeal.appeal_id,
                    status_appeal_id: cancelled?.status_appeal_id,
                    appeal_message: 'Auto cancelled by system',
                },
            }),
        ]);
        await prisma.$transaction(operations);
    }
    catch (error) {
        console.error(error);
        throw error;
    }
    finally {
        await prisma.$disconnect();
    }
}
