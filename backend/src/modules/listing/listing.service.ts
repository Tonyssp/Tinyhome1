import {
  ListingApprovalStatus,
  ListingAvailabilityStatus,
  Prisma,
  Role,
} from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../../config/prisma";
import { ApiError } from "../../utils/api-error";
import { getPagination } from "../../utils/pagination";
import { defaultAmenities } from "./default-amenities";

type Actor = {
  id: string;
  role: Role;
};

type CreateListingInput = {
  title: string;
  description: string;
  price: number;
  deposit: number;
  city: string;
  district: string;
  village: string;
  address: string;
  type: Prisma.ListingCreateInput["type"];
  availabilityStatus?: ListingAvailabilityStatus;
  amenityIds: string[];
  images: Array<{ imageUrl: string; publicId: string; sortOrder?: number }>;
};

type UpdateListingInput = Partial<CreateListingInput> & {
  approvalStatus?: ListingApprovalStatus;
};

type ListQuery = {
  page?: number;
  limit?: number;
  keyword?: string;
  city?: string;
  district?: string;
  minPrice?: number;
  maxPrice?: number;
  amenities?: string;
  type?: Prisma.ListingWhereInput["type"];
  sortBy?: "price_asc" | "newest" | "rating";
  myListings?: boolean;
};

async function assertAmenitiesExist(amenityIds: string[]) {
  const amenityCount = await prisma.amenity.count({
    where: { id: { in: amenityIds } },
  });

  if (amenityCount !== amenityIds.length) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "One or more amenities are invalid");
  }
}

async function getListingOrThrow(id: string) {
  const listing = await prisma.listing.findUnique({
    where: { id },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      amenities: {
        include: {
          amenity: true,
        },
      },
      landlord: {
        select: {
          id: true,
          fullName: true,
          email: true,
          phone: true,
          role: true,
        },
      },
    },
  });

  if (!listing || listing.deletedAt) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Listing not found");
  }

  return listing;
}

function ensureListingWriteAccess(actor: Actor, landlordId: string) {
  if (actor.role !== Role.ADMIN && actor.id !== landlordId) {
    throw new ApiError(StatusCodes.FORBIDDEN, "You do not have permission to manage this listing");
  }
}

export const listingService = {
  async listAmenities() {
    const amenityCount = await prisma.amenity.count();

    if (amenityCount === 0) {
      await prisma.amenity.createMany({
        data: defaultAmenities,
        skipDuplicates: true,
      });
    }

    return prisma.amenity.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    });
  },

  async createListing(actor: Actor, payload: CreateListingInput) {
    if (actor.role !== Role.LANDLORD && actor.role !== Role.ADMIN) {
      throw new ApiError(StatusCodes.FORBIDDEN, "Only landlords or admins can create listings");
    }

    await assertAmenitiesExist(payload.amenityIds);

    const listing = await prisma.listing.create({
      data: {
        title: payload.title,
        description: payload.description,
        price: new Prisma.Decimal(payload.price),
        deposit: new Prisma.Decimal(payload.deposit),
        city: payload.city,
        district: payload.district,
        village: payload.village,
        address: payload.address,
        type: payload.type,
        availabilityStatus: payload.availabilityStatus ?? ListingAvailabilityStatus.AVAILABLE,
        approvalStatus: actor.role === Role.ADMIN ? ListingApprovalStatus.APPROVED : ListingApprovalStatus.PENDING,
        approvedAt: actor.role === Role.ADMIN ? new Date() : null,
        approvedById: actor.role === Role.ADMIN ? actor.id : null,
        landlordId: actor.id,
        amenities: {
          create: payload.amenityIds.map((amenityId) => ({
            amenity: { connect: { id: amenityId } },
          })),
        },
        images: {
          create: payload.images.map((image, index) => ({
            imageUrl: image.imageUrl,
            publicId: image.publicId,
            sortOrder: image.sortOrder ?? index,
          })),
        },
      },
      include: {
        images: true,
        amenities: { include: { amenity: true } },
      },
    });

    return listing;
  },

  async listListings(query: ListQuery, actor?: Actor) {
    const { page, limit, skip } = getPagination(query.page, query.limit);
    const amenityValues = query.amenities?.split(",").map((value) => value.trim()).filter(Boolean);

    const where: Prisma.ListingWhereInput = {
      deletedAt: null,
      ...(query.keyword
        ? {
            OR: [
              { title: { contains: query.keyword, mode: "insensitive" } },
              { description: { contains: query.keyword, mode: "insensitive" } },
              { address: { contains: query.keyword, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(query.city ? { city: { equals: query.city, mode: "insensitive" } } : {}),
      ...(query.district ? { district: { equals: query.district, mode: "insensitive" } } : {}),
      ...(query.type ? { type: query.type } : {}),
      ...(query.minPrice || query.maxPrice
        ? {
            price: {
              ...(query.minPrice ? { gte: new Prisma.Decimal(query.minPrice) } : {}),
              ...(query.maxPrice ? { lte: new Prisma.Decimal(query.maxPrice) } : {}),
            },
          }
        : {}),
      ...(amenityValues?.length
        ? {
            amenities: {
              some: {
                amenity: {
                  OR: [
                    { id: { in: amenityValues } },
                    { slug: { in: amenityValues.map((value) => value.toLowerCase()) } },
                    { name: { in: amenityValues, mode: "insensitive" } },
                  ],
                },
              },
            },
          }
        : {}),
    };

    if (query.myListings && actor) {
      where.landlordId = actor.id;
    } else {
      where.approvalStatus = ListingApprovalStatus.APPROVED;
    }

    const orderBy: Prisma.ListingOrderByWithRelationInput =
      query.sortBy === "price_asc"
        ? { price: "asc" }
        : query.sortBy === "rating"
          ? { rating: "desc" }
          : { createdAt: "desc" };

    const [items, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          images: {
            orderBy: { sortOrder: "asc" },
            take: 1,
          },
          amenities: {
            include: {
              amenity: true,
            },
          },
          landlord: {
            select: {
              id: true,
              fullName: true,
              phone: true,
            },
          },
        },
      }),
      prisma.listing.count({ where }),
    ]);

    return {
      items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async getListingById(id: string, actor?: Actor) {
    const listing = await getListingOrThrow(id);

    if (
      listing.approvalStatus !== ListingApprovalStatus.APPROVED &&
      actor?.role !== Role.ADMIN &&
      actor?.id !== listing.landlordId
    ) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Listing not found");
    }

    return listing;
  },

  async updateListing(id: string, payload: UpdateListingInput, actor: Actor) {
    const existing = await getListingOrThrow(id);
    ensureListingWriteAccess(actor, existing.landlordId);

    if (payload.amenityIds) {
      await assertAmenitiesExist(payload.amenityIds);
    }

    return prisma.$transaction(async (tx) => {
      if (payload.amenityIds) {
        await tx.listingAmenity.deleteMany({ where: { listingId: id } });
      }

      if (payload.images) {
        await tx.listingImage.deleteMany({ where: { listingId: id } });
      }

      return tx.listing.update({
        where: { id },
        data: {
          title: payload.title,
          description: payload.description,
          price: payload.price === undefined ? undefined : new Prisma.Decimal(payload.price),
          deposit: payload.deposit === undefined ? undefined : new Prisma.Decimal(payload.deposit),
          city: payload.city,
          district: payload.district,
          village: payload.village,
          address: payload.address,
          type: payload.type,
          availabilityStatus: payload.availabilityStatus,
          approvalStatus: actor.role === Role.ADMIN
            ? payload.approvalStatus
            : ListingApprovalStatus.PENDING,
          approvedAt:
            actor.role === Role.ADMIN && payload.approvalStatus === ListingApprovalStatus.APPROVED
              ? new Date()
              : actor.role === Role.ADMIN && payload.approvalStatus
                ? null
                : actor.role !== Role.ADMIN
                  ? null
                  : undefined,
          approvedById:
            actor.role === Role.ADMIN
              ? payload.approvalStatus === ListingApprovalStatus.APPROVED
                ? actor.id
                : null
              : null,
          amenities: payload.amenityIds
            ? {
                create: payload.amenityIds.map((amenityId) => ({
                  amenity: { connect: { id: amenityId } },
                })),
              }
            : undefined,
          images: payload.images
            ? {
                create: payload.images.map((image, index) => ({
                  imageUrl: image.imageUrl,
                  publicId: image.publicId,
                  sortOrder: image.sortOrder ?? index,
                })),
              }
            : undefined,
        },
        include: {
          images: true,
          amenities: { include: { amenity: true } },
        },
      });
    });
  },

  async deleteListing(id: string, actor: Actor) {
    const existing = await getListingOrThrow(id);
    ensureListingWriteAccess(actor, existing.landlordId);

    await prisma.listing.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  },
};
