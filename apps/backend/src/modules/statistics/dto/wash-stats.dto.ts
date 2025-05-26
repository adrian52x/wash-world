export class WashStats {
  totalSpent: number;
  mostUsedLocation: {
    name: string;
    visitCount: number;
  };
  favoriteWashType: {
    type: string;
    useCount: number;
  };
  lastMonthWashes: number;
}