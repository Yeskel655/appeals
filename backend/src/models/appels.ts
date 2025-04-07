import { Appeal, AppealMessage, AppealStatus, AppealTopic, PrismaClient } from '@prisma/client';
import { prismaAppeal } from './prisma.js';

export type IAppealCreate = {
    topicId: number;
    message: string
}

export type IAppealsReturn = Appeal & { AppealMessage: AppealMessage | null, AppealStatus: AppealStatus | null, AppealTopic: AppealTopic | null }

/**
 * получение обращений
 * @param prisma
 * @returns
 */
export async function getAppeals(
    prisma: PrismaClient = prismaAppeal): Promise<IAppealsReturn[]> {
    try {
        await prisma.$connect();

        const data = await prisma.appeal.findMany({
            include: { AppealMessage: true, AppealStatus: true, AppealTopic: true },
        })

        return data
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

/**
 * получение обращений
 * @param prisma
 * @returns
 */
export async function getAppealById(
    id: number,
    prisma: PrismaClient = prismaAppeal): Promise<IAppealsReturn | null> {
    try {
        await prisma.$connect();

        const data = await prisma.appeal.findUnique({
            where: { appealId: id },
            include: { AppealMessage: true, AppealStatus: true, AppealTopic: true },
        })

        return data
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

/**
 * создание обращения
 * @param prisma
 * @returns
 */
export async function createAppeal(
    appealData: IAppealCreate,
    prisma: PrismaClient = prismaAppeal
): Promise<Appeal> {
    try {
        await prisma.$connect();

        const { topicId, message } = appealData;

        const status = await prisma.appealStatus.findFirst({
            where: { appealStatusCypher: 'NEW' },
        });

        if (!status) {
            throw new Error("Статус 'NEW' не найден");
        }

        const result = await prisma.$transaction(async (tx) => {
            const createdAppeal = await tx.appeal.create({
                data: {
                    appealTopicId: topicId,
                    appealStatusId: status.appealStatusId,
                },
            });

            const createdMessage = await tx.appealMessage.create({
                data: {
                    appealId: createdAppeal.appealId,
                    appealStatusId: status.appealStatusId,
                    appealMessage: message,
                },
            });

            await tx.appeal.update({
                where: { appealId: createdAppeal.appealId },
                data: { appealMessageId: createdMessage.appealMessageId },
            });

            return createdAppeal;
        });

        return result;
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

/**
 * перевод обращение в статус в работе
 * @param prisma
 * @returns
 */
export async function appealToWork(
    id: number,

    prisma: PrismaClient = prismaAppeal
): Promise<Appeal> {
    try {
        await prisma.$connect();

        const status = await prisma.appealStatus.findFirst({ where: { appealStatusCypher: 'WORK' } });

        if (!status) {
            throw new Error("Статус 'WORK' не найден");
        }

        const updated = await prisma.appeal.update({ where: { appealId: id }, data: { appealStatusId: status?.appealStatusId } });

        return updated
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

/**
 * перевод обращение в статус "Завершено"
 * @param prisma
 * @returns
 */
export async function appealToComplete(
    id: number,
    resolution: string,
    prisma: PrismaClient = prismaAppeal
): Promise<Appeal> {
    try {
        await prisma.$connect();

        const status = await prisma.appealStatus.findFirst({ where: { appealStatusCypher: 'COMPLETED' } });

        if (!status) {
            throw new Error("Статус 'COMPLETED' не найден");
        }

        const [updatedAppeal, createdMessage] = await prisma.$transaction([
            prisma.appeal.update({
                where: { appealId: id },
                data: { appealStatusId: status?.appealStatusId },
            }),
            prisma.appealMessage.create({
                data: {
                    appealId: id,
                    appealStatusId: status?.appealStatusId,
                    appealMessage: resolution,
                },
            }),
        ]);


        return updatedAppeal
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

/**
 * перевод обращение в статус "Отменено"
 * @param prisma
 * @returns
 */
export async function appealToCancel(
    id: number,
    reason: string,
    prisma: PrismaClient = prismaAppeal
): Promise<Appeal> {
    try {
        await prisma.$connect();

        const status = await prisma.appealStatus.findFirst({ where: { appealStatusCypher: 'CANCELLED' } });

        if (!status) {
            throw new Error("Статус 'CANCELLED' не найден");
        }

        const [updatedAppeal, createdMessage] = await prisma.$transaction([
            prisma.appeal.update({
                where: { appealId: id },
                data: { appealStatusId: status?.appealStatusId },
            }),
            prisma.appealMessage.create({
                data: {
                    appealId: id,
                    appealStatusId: status?.appealStatusId,
                    appealMessage: reason,
                },
            }),
        ]);
        return updatedAppeal
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

/**
 * перевод обращение в статус "Отменено" всех обращений
 * @param prisma
 * @returns
 */
export async function appealToCancelAllWork(
    prisma: PrismaClient = prismaAppeal
): Promise<void> {
    try {
        await prisma.$connect();

        const inProgress = await prisma.appealStatus.findFirst({ where: { appealStatusCypher: 'WORK' } });

        if (!inProgress) {
            throw new Error("Статус 'WORK' не найден");
        }

        const cancelled = await prisma.appealStatus.findFirst({ where: { appealStatusCypher: 'CANCELLED' } });

        if (!cancelled) {
            throw new Error("Статус 'CANCELLED' не найден");
        }

        const appeals = await prisma.appeal.findMany({
            where: { appealStatusId: inProgress?.appealStatusId },
        });

        const operations = appeals.flatMap((appeal) => [
            prisma.appeal.update({
                where: { appealId: appeal.appealId },
                data: { appealStatusId: cancelled?.appealStatusId },
            }),
            prisma.appealMessage.create({
                data: {
                    appealId: appeal.appealId,
                    appealStatusId: cancelled?.appealStatusId,
                    appealMessage: 'Auto cancelled by system',
                },
            }),
        ]);

        await prisma.$transaction(operations);

    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}