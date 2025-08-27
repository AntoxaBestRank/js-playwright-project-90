import { TaskStatus } from '../interfaces';

export const listStatuses: TaskStatus[] = [
  {
    "id": 1,
    "name": "Draft",
    "slug": "draft",
  },
  {
    "id": 2,
    "name": "To Review",
    "slug": "to_review",
  },
  {
    "id": 3,
    "name": "To Be Fixed",
    "slug": "to_be_fixed",
  },
  {
    "id": 4,
    "name": "To Publish",
    "slug": "to_publish",
  },
  {
    "id": 5,
    "name": "Published",
    "slug": "published",
  }
];
