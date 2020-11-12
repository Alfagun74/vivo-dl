import * as fs from 'fs';
import fetch from 'node-fetch';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import cheerio from 'cheerio';
import {Video} from './models/video';
import puppeteer from 'puppeteer-extra';
puppeteer.use(StealthPlugin());
puppeteer.use(
  require('puppeteer-extra-plugin-block-resources')({
    blockedTypes: new Set(['image', 'stylesheet', 'font']),
  })
);

export async function vivodl(
  destinationFolder = '',
  vivoUrls: string[] = []
): Promise<Video[]> {
  let videos: Video[] = [];
  try {
    videos = await fetchVideoSources(vivoUrls);
    await downloadVideos(videos, destinationFolder);
  } catch (error) {
    console.error(error);
    //throw error;
  }
  return videos;
}

async function fetchVideoSources(vivoUrls: string[]): Promise<Video[]> {
  console.log('▶ Fetching all video sources');
  const videos: Video[] = [];
  const browser = await puppeteer.launch({headless: true});
  const context = await browser.createIncognitoBrowserContext();
  await Promise.all(
    vivoUrls.map(async (vivoUrl: string) => {
      const page = await context.newPage();
      //await page.setRequestInterception(true);
      await page.goto(vivoUrl);
      await Promise.all([
        page.waitForSelector('div.stream-content'),
        page.waitForSelector('source'),
      ]);
      const $ = cheerio.load(
        await page.evaluate(() => document.body.innerHTML)
      );
      await page.close();
      const extractedName = $('div.stream-content').attr('data-name')!;
      const extractedUrl = $('source').attr('src')!;
      videos.push(new Video(extractedName, extractedUrl, vivoUrl));
    })
  );
  await browser.close();
  console.log('✔ Fetched all video sources');
  return videos;
}

async function downloadVideos(videos: Video[], destinationFolder: string) {
  if (!destinationFolder) {
    console.log('✨ Fetched the video URIs}');
    return;
  }
  console.log('▶ Starting video downloads');
  destinationFolder = stripPath(destinationFolder);
  await Promise.all(
    videos.map(async video => {
      const dest = `${destinationFolder}/${video.filename}`;
      const response = await fetch(video.videoUrl);
      await fs.promises.writeFile(dest, await response.buffer());
      console.log(
        `✔ Downloaded video ${video.filename} from ${video.vivoUrl} to ${dest}`
      );
    })
  );
  console.log(`✨ Downloaded all videos to ${destinationFolder}`);
}

function stripPath(path: string): string {
  return path.replace(/\/$/, '');
}
