export interface Course {
  orgCode: string;
  courseName: string;
  state: string;
  city: string;
  shortCode: string;
  createdAt: Date;
  updatedAt: Date;
  activeForLostAndFound: boolean;
  shortLink: string;
  link: string;
}
