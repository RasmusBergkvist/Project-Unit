import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-scroll-button',
  imports: [],
  templateUrl: './scroll-button.html',
  styleUrl: './scroll-button.scss',
  host: {
    "(window:scroll)": "handleScroll()" //Lyssnar efter scroll i webbläsaren
  }
})
export class ScrollButton {
  //Signal för om scrollknappen ska visas eller inte
    showBtn = signal<boolean>(false);

    handleScroll(): void {
      //Ändrar showBtn till true 600px scrollning
      this.showBtn.set(window.scrollY> 600);

    }

  scrollToTop(): void {

    //Scrollar mjuk upp till toppen av sidan
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

}
