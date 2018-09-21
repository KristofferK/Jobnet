import { Browser, Page, launch, Response } from 'puppeteer';
import { credentails } from './jobnet-credentials';
import { JobSeekingHistory } from './job-seeking-history';
import { existsSync, mkdirSync, promises } from 'fs';

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

  async login(username: string, password: string): Promise<string> {
    await this.page.goto('https://job.jobnet.dk/CV/Frontpage');
    await this.page.focus('#JobnetUsername');
    await this.page.keyboard.type(username);
    await this.page.focus('#JobnetPassword');
    await this.page.keyboard.type(password);
    await this.page.click('#LoginButton')  
    await this.screenshot('01_login_button_clicked.png');
    await this.page.waitForSelector('#TjobButton');
    await this.screenshot('02_login_successful.png');
    return this.getFullname();
  }

  private async screenshot(file: string) {
    return this.page.screenshot({ path: `${this.screenshotsFolder}/${file}` });
  }

  private async getFullname() {
    return this.page.evaluate(() => {
      const nameTag = <HTMLSpanElement>document.querySelector('.page-area.header-area span');
      if (nameTag !== null) {
        return nameTag.innerText;
      }
      return null;
    });
  }

  async markJobPostingsAsRead() {
    await this.page.click('#TjobButton');
    await this.screenshot('03_job_postings_marked_as_read.png');
  }

  async getJobSeekingHistory(): Promise<JobSeekingHistory[]> {
    const response = await this.page.goto('https://job.jobnet.dk/CV/Citizen/History/ConfirmJobseeking?showAll=true');
    if (response !== null) {
      const body = await response.json();
      await this.screenshot('04_history.png');
      return body.map((e: any) => new JobSeekingHistory(e[0].value, e[1].value, e[2].value));
    }
    else {
      await this.screenshot('04_history_failed.png');
      return [];
    }
  }
}

(async() => {
  const client = await JobnetClient.initialize();
  
  const username = await client.login(credentails.username, credentails.password);
  console.log('Logged in as', username);
  
  await client.markJobPostingsAsRead();
  console.log('Marked job posts as read');

  const history = await client.getJobSeekingHistory();
  console.log(history);

  process.exit();
})();
