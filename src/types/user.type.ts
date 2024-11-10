interface User {
    id: string;
    firstName: string;
    lastName: string;
    birthdate?: Date;
    avatar?: string;
    reviews: Review[];
    purchasedVinylRecords: VinylRecord[];
  }