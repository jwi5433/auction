import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "auction/server/api/trpc";

export const auctionRouter = createTRPCRouter({
    //get all auctions
    getAll: publicProcedure.query(async ({ ctx }) => {
        return ctx.db.auction.findMany({
            where: {
                isActive: true,
            },
            orderBy: { createdAt: "desc" },
            include: {
                createdBy: {
                    select: {
                        name: true,
                        image: true,
                    },
                },
            },
        });
    }),

    //get single auction
    getById: publicProcedure
        .input(z.string())
        .query(async ({ ctx, input }) => {
            return ctx.db.auction.findUnique({
                where: { id: input },
                include: {
                    createdBy: {
                        select: {
                            name: true,
                            image: true,
                        },
                    },
                    bids: {
                        orderBy: { createdAt: "desc" },
                        include: {
                            user: {
                                select: {
                                    name: true,
                                    image: true,
                                },
                            },
                        },
                    },
                },
            });
        }),
    
});