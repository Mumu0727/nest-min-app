export class CreatePostDto {
  userId: number;
  menuList: Array<{ id: number; name: string }>;
  content: string;
  releaseDate: Date;
}
