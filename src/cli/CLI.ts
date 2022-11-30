import { stdin as input, stdout as output } from "node:process"
import readline from "node:readline"
import { Actions } from "./Actions.js"
import { Colors_Background, Colors_Font, Colors_Settings, GlobalColors } from "../utils/Colors.js"

type CLIColor = {
  settings?: Colors_Settings
  font?: Colors_Font
  bg?: Colors_Background
}

export class CLI {
  private static instance: CLI
  private formatedColors: string = "\x1b[0m"
  private separator: string =
    GlobalColors.Magenta + "\n--------------------------\n\n"
  static teton = "teton"

  private constructor() {
    this.config()
  }

  private config() {
    readline.emitKeypressEvents(input)
    if (input.isTTY)
      input.setRawMode(true)
  }

  static getInstance(): CLI {
    if (this.instance) return this.instance

    this.instance = new CLI()
    return this.instance
  }

  async start(message: string, colors?: CLIColor) {
    this.translateColor(colors)

    console.clear()
    output.write(`${this.formatedColors}${message}${this.separator}`);

    Actions.summary()
  }

  private translateColor(colors: CLIColor): void {
    this.formatedColors += GlobalColors[colors.bg] || ""
    this.formatedColors += GlobalColors[colors.font] || ""
    this.formatedColors += GlobalColors[colors.settings] || ""
  }
}

