import { stdout as output } from "node:process";
import { GlobalColors } from "../utils/Colors.js";
import { Component } from "./Component.js";
export class Actions extends Component {
    instantiedCLI;
    static instance;
    constructor(instantiedCLI) {
        super(instantiedCLI);
        this.instantiedCLI = instantiedCLI;
    }
    static getInstance(instantiedCLI) {
        if (this.instance)
            return this.instance;
        this.instance = new Actions(instantiedCLI);
        return this.instance;
    }
    async prompt_Ordonned_List(items) {
        this.instruction("Please chose an index below and press Enter.");
        const text = this.format_Ordonned_List_With_Color_Settings(items);
        output.write(text);
        const { name: keypressed } = await this.keypressHandler();
        return keypressed;
    }
    format_Ordonned_List_With_Color_Settings(texts) {
        const beforeIndex = GlobalColors.Reset + GlobalColors.Red;
        const afterIndex = GlobalColors.Green;
        const beforeText = GlobalColors.Yellow;
        const formatedOrdonnedList = texts.map((text, index) => `${beforeIndex}${index}${afterIndex} --${beforeText} ${text}\n`).join('');
        return formatedOrdonnedList;
    }
}
