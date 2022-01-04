export module MathChecker {
  export class MathChecker {
    cp: number; // the cursor position;
    cln: number; // the cursor line number;
    textLst: string[]; // the text list;
    constructor(cln: number, cp: number, textLst: string[]) {
      this.cp = cp;
      this.cln = cln;
      // map testLst to this.testLst but replacing all the "\$" with "¡¡";
      // and replacing all the "\`" with "££"
      // and replacing all the "`(.*?)`" with "¡" of equal length;
      this.textLst = textLst
        .map(line => line.replace(/\\\$/g, "¡¡").replace(/\\\`/g, "££"))
        .map(line =>
          line.replace(/`([^`]+?)`/g, (match, p1) => {
            let len = p1.length;
            let str = "";
            for (let i = 0; i < len; i++) {
              str += "¡";
            }
            return `¡${str}¡`;
          })
        );
    }
    // get the line text;
    getLineStr(ln: number = this.cln): string {
      return this.textLst[ln];
    }
    // get the character at the cursor position;
    getCharStr(cp: number = this.cp, ln: number = this.cln): string {
      return this.getLineStr().charAt(this.cp);
    }
    // checks the block;
    checkBlock(separator: string): boolean {
      // iterate through the text list and count the number of "$$" before the cursor position;
      let countBefore: number = 0;
      for (let i = 0; i < this.cln; i++) {
        countBefore += this.textLst[i].split(separator).length - 1;
      }
      // count the number of "$$" before the cursor position in the current line;
      countBefore +=
        this.getLineStr()
          .substring(0, this.cp)
          .split(separator).length - 1;
      // return true and avoid the other calculation if previous things are odd;
      if (countBefore % 2 == 0) {
        return false;
      }
      // count the number of "$$" after the cursor position in the current line;
      let countAfter: number = 0;
      countAfter +=
        this.getLineStr()
          .substring(this.cp)
          .split(separator).length - 1;
      // count the number of "$$" after the cursor position in the following lines;
      for (let i = this.cln + 1; i < this.textLst.length; i++) {
        countAfter += this.textLst[i].split(separator).length - 1;
      }
      if (countAfter % 2 == 0) {
        return false;
      } else {
        return true;
      }
    }
    // checks the block math;
    checkBlockMath(): boolean {
      const inCode = this.checkBlock("```");
      const inBlockMath = this.checkBlock("$$");
      if (inCode) {
        return false;
      } else {
        return inBlockMath;
      }
    }

    // checks the inline math;
    checkInlineMath(): boolean {
      // find the number of "$" before the cursor position in the current line;
      let countBefore: number = 0;
      countBefore +=
        this.getLineStr()
          .substring(0, this.cp)
          .split("$").length - 1;
      // return true and avoid the other calculation if previous things are odd;
      if (countBefore % 2 == 0) {
        console.log("breakpoint 1, " + countBefore);
        console.log(
          this.getLineStr()
            .substring(0, this.cp)
            .split("$")
        );
        return false;
      }
      // find the number of "$" after the cursor position in the current line;
      let countAfter: number = 0;
      countAfter +=
        this.getLineStr()
          .substring(this.cp)
          .split("$").length - 1;
      // return true and avoid the other calculation if previous things are odd;
      if (countAfter % 2 == 0) {
        console.log("breakpoint 2");
        return false;
      } else {
        console.log("breakpoint 3");
        return true;
      }
    }
    checkInMath(): boolean {
      return this.checkInlineMath() || this.checkBlockMath();
    }
  }
}
