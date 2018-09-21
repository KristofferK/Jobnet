import { Browser, Page, launch } from 'puppeteer';
import { credentails } from './jobnet-credentials';
import { existsSync, mkdirSync } from 'fs';

class JobnetClient {
  private screenshotsFolder = "screenshots/";
  
  private constructor(private browser: Browser, private page: Page) {
    if (!existsSync(this.screenshotsFolder)) {
      mkdirSync(this.screenshotsFolder);
    }
  }
  
  static async initialize(width: number = 1280, height: number = 800): Promise<JobnetClient> {
    const browser = await launch();
    const page = await browser.newPage();
    page.setViewport({width: width, height: height});
    return Promise.resolve(new JobnetClient(browser, page));
  }

  async login(username: string, password: string) {
    await this.page.goto('https://job.jobnet.dk/CV/Frontpage');
    await this.page.focus('#JobnetUsername');
    await this.page.keyboard.type(username);
    await this.page.focus('#JobnetPassword');
    await this.page.keyboard.type(password);
    await this.page.click('#LoginButton')  
    await this.screenshot('keyboard.png');
  }

  private async screenshot(file: string) {
    return this.page.screenshot({ path: `${this.screenshotsFolder}/${file}` });
  }
}

(async() => {
  const client = await JobnetClient.initialize();
  await client.login(credentails.username, credentails.password);
})();