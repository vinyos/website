// Die Scrollposition wählt ein Kapitel. Ein begonnener Übergang läuft immer bis zum Rastpunkt.
export class ScrollMotion {
  from: number;
  to: number;
  started = 0;
  restUntil = 0;
  readonly duration = 1200;

  constructor(chapter: number) { this.from=chapter; this.to=chapter; }
  get moving() { return this.from!==this.to; }

  update(target: number, now: number, reduced: boolean): number {
    if(reduced){this.from=target;this.to=target;this.restUntil=0;return target;}
    if(!this.moving && target!==this.to && now>=this.restUntil){
      this.from=this.to; this.to+=Math.sign(target-this.to); this.started=now;
    }
    if(!this.moving) return this.to;
    const amount=Math.min(1,Math.max(0,(now-this.started)/this.duration));
    if(amount===1){this.from=this.to;this.restUntil=now+140;}
    return this.from+(this.to-this.from)*amount;
  }
}
