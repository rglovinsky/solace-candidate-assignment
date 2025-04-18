export type Advocate = {
  id: number;
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  specialties: string[];
  yearsOfExperience: number;
  phoneNumber: string;
};

export type ApiResponse = {
  data: Advocate[];
  total: number;
  skip: number;
  take: number;
};
