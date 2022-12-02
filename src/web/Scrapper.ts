import puppeteer, { Page, registerCustomQueryHandler } from "puppeteer";
import { GlobalColors } from "../utils/Colors.js";

export class Scrapper {
  private static instance: Scrapper
  private page: Page

  constructor() {
    this.start()
  }

  static getInstance(): Scrapper {
    if (this.instance) return this.instance

    this.instance = new Scrapper()
    return this.instance
  }

  private async start() {
    const browser = await puppeteer.launch()
    this.page = await browser.newPage()
  }

  async random(): Promise<string> {
    // 1. Request to the url below that redirect to random article 
    await this.page.goto("https://fr.wikipedia.org/wiki/Sp%C3%A9cial:Page_au_hasard", { waitUntil: "domcontentloaded" })

    // 2. Get h1 and multiple p elements, then extract them text 
    const h1El = await this.page.$("#firstHeading")
    const h1 = await (await h1El.getProperty('textContent')).jsonValue()

    const p1El = await this.page.$$("#mw-content-text > div > p")
    let p: string

    // 3. Control if the p isn't empty and return formatted string
    for (const el of p1El) {
      const text = await (await el.getProperty("textContent")).jsonValue()

      if (text.trim() !== "") {
        p = text
        break
      }
    }

    const result = `Title : ${h1}\nShort Description : ${p.slice(0, 75)}...\n\nSee the article : ${this.page.url()}`
    return result
  }

  async categories(): Promise<string> {
    // 1. Open page 'Categorie' and get categories' ancre
    await this.page.goto("https://fr.wikipedia.org/wiki/Cat%C3%A9gorie:Accueil")
    const categoriesElements = await this.page.$$("#mw-content-text > div > div:nth-child(3) b > a")

    // 2. Extract each name and url and format them in string 
    const categories = categoriesElements.map(async el => {
      const categoryName = await (await el.getProperty("textContent")).jsonValue()
      const url = await (await el.getProperty("href")).jsonValue()

      return `${GlobalColors.Yellow}Category : ${GlobalColors.White}${categoryName}\n${GlobalColors.Green}See the page : ${GlobalColors.White}${GlobalColors.Underscore}${url}${GlobalColors.Reset}`
    })

    // 3. Return string that contain all category previously formated
    const result = await Promise.all(categories)
    return result.join("\n\n")
  }

  async research(search: string) {

    return "Heyhey"
  }
}