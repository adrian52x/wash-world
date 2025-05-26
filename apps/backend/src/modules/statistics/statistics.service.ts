import { forwardRef, Inject, Injectable, Logger } from "@nestjs/common";
import { WashesService } from "../washes/washes.service";
import { WashTypeEnum } from "../../utils/enums";
import { WashStats } from "./dto/wash-stats.dto";
import { UserWashDTO } from "../washes/dto/user-wash-dto";

type LocationCount = {
  name: string;
  count: number;
}

type WashTypeCount = {
  type: string;
  count: number;
}

@Injectable()
export class StatisticsService {
  private readonly logger = new Logger(StatisticsService.name);

  constructor(
    @Inject(forwardRef(() => WashesService))
    private readonly washesService: WashesService,
  ) { }

  private calculateTotalSpent(userWashes: UserWashDTO[]): number {
    return userWashes.reduce((sum, wash) => sum + Number(wash.washType.price), 0);
  }

  private findMostUsedLocation(userWashes: UserWashDTO[]): { name: string; visitCount: number } {
    const locationCounts = userWashes.reduce((counts, wash) => {
      const locationId = wash.location.locationId;
      if (!counts[locationId]) {
        counts[locationId] = { name: wash.location.name, count: 0 };
      }
      counts[locationId].count++;
      return counts;
    }, {});

    const locations = Object.values(locationCounts) as LocationCount[];

    if (locations.length === 0) {
      return { name: '', visitCount: 0 };
    }

    const mostUsed = locations.reduce((current, location) =>
      location.count > current.count ? location : current,
      { name: '', count: 0 });

    return {
      name: mostUsed.name,
      visitCount: mostUsed.count
    };
  }

  private findFavoriteWashType(userWashes: UserWashDTO[]): { type: string; useCount: number } {
    const washTypeCounts = userWashes.reduce((counts, wash) => {
      const washTypeId = wash.washType.washTypeId;
      if (!counts[washTypeId]) {
        counts[washTypeId] = { type: wash.washType.type, count: 0 };
      }
      counts[washTypeId].count++;
      return counts;
    }, {});

    const washTypes = Object.values(washTypeCounts) as WashTypeCount[];

    if (washTypes.length === 0) {
      return { type: '', useCount: 0 };
    }

    const favorite = washTypes.reduce((current, washType) =>
      washType.count > current.count ? washType : current,
      { type: '', count: 0 });

    return {
      type: WashTypeEnum[favorite.type] || favorite.type,
      useCount: favorite.count
    };
  }

  private calculateLastMonthWashes(userWashes: UserWashDTO[]): number {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

    return userWashes.filter(wash => {
      const washDate = new Date(wash.createdAt);
      return washDate >= lastMonth && washDate <= now;
    }).length;
  }

  async getUserWashStats(userId: number): Promise<WashStats> {
    this.logger.log(`Getting wash statistics for user`);

    const userWashes = await this.washesService.getUserWashes(userId);

    const totalSpent = this.calculateTotalSpent(userWashes);
    const mostUsedLocation = this.findMostUsedLocation(userWashes);
    const favoriteWashType = this.findFavoriteWashType(userWashes);
    const lastMonthWashes = this.calculateLastMonthWashes(userWashes);

    return {
      totalSpent,
      mostUsedLocation,
      favoriteWashType,
      lastMonthWashes
    };
  }


}