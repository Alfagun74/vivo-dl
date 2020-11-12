export class Video {
  public filename: string;
  public videoUrl: string;
  public vivoUrl: string;

  constructor(name: string, videoUrl: string, vivoUrl: string) {
    this.filename = name;
    this.videoUrl = videoUrl;
    this.vivoUrl = vivoUrl;
  }
}
