# vivo-dl
## A node.js vivo.sx video downloader
### Description
vivo-dl is a module that can download .mp4 files from [vivo.sx](https://vivo.sx).
Just provide a path and some [vivo.sx](https://vivo.sx) urls and it downloads the videos.

### List of features
*   simple
*   asynchronous
*   fast
*   supports typescript

### Installation
#### Using NPM
```shell 
$ npm i vivo-dl
```
#### Using Yarn
```shell 
$ yarn add vivo-dl
```

### Usage
Just call the vivodl function with a destination folder and an array of URLS and it will download the files to your given destination and then return a ```Promise<Video[]>```.

```ts
vivodl('./dest', [
  'https://vivo.sx/1234567890',
  'https://vivo.sx/0987654321',
]).then(videos => {
  console.log(videos);
});
```
#### Optional Parameters
* If you just want to fetch the video source URIs and do not want to download them just provide an empty path

#### Data
A Video is a data model that contains the following attributes:
```ts
{
  filename: string;   // grabs the name of the file uploaded to vivo.sx
  videoUrl: string;   // the source video URL that was embedded in vivo.sx
  vivoUrl: string;    // the vivo.sx url you provided
}
```
### Contributing
Everyone is welcome to contibute, to help this project.

### License
This project is licensed under the MIT License
