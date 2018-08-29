import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-image-puzzle',
  templateUrl: './image-puzzle.component.html',
  styleUrls: ['./image-puzzle.component.css']
})

export class ImagePuzzleComponent implements OnInit {
  //imageUrl: string = 'https://s3-eu-west-1.amazonaws.com/wagawin-ad-platform/media/testmode/banner-landscape.jpg';
  imageUrl: string = '../assets/images/test.jpg';
  imageSize: number = 500;
  colSize: number = 4;
  rawSize: number = 3;
  boxSize: number = 100 / (this.colSize - 1);
  index: number = 0;
  totalBoxes: number = this.colSize * this.rawSize;
  Image: any[] = [];
  imageName: string = this.imageUrl.substr(this.imageUrl.lastIndexOf('/') + 1).split('.')[0];
  steps: number = 0;
  gameComplete: Boolean = false;

  indexes: number[] = [];
  position: number[] = [];
  ngOnInit() {
    this.startGame();
  }

  isSorted(indexes): Boolean {
    let i: number = 0;
    for (i = 0; i < indexes.length; i++) {
      if (indexes[i] !== i) {
        return false;
      }
    }
    return true;
  }

  randomize(imageParts: any[]): any[] {
    let i = 0, img: any[] = [], ran = 0;
    for (i = 0; i < imageParts.length; i++) {
      ran = Math.floor(Math.random() * imageParts.length);
      while (imageParts[ran] == null) {
        ran = Math.floor(Math.random() * imageParts.length);
      }
      img.push(imageParts[ran]);
      this.position.push(imageParts[ran].index);
      imageParts[ran] = null;
    }
    this.printIndexes(this.indexes);
    this.printIndexes(this.position);
    return img;
  }

  onDragStart(event: any, data: any): void {
    event.dataTransfer.setData('data', event.target.id);
  }

  onDrop(event: any, data: any): void {
    let origin = event.dataTransfer.getData('data');
    let dest = event.target.id;


    let originEl = document.getElementById(origin);
    let destEl = document.getElementById(dest);

    let origincss = originEl.style.cssText;
    let destcss = event.target.style.cssText;


    destEl.style.cssText = origincss;
    originEl.style.cssText = destcss;
    originEl.id = dest;
    destEl.id = origin;


    for (let i = 0; i < this.position.length; i++) {
      if (this.position[i].toString() === originEl.id) {
        this.position[i] = Number(destEl.id);
      } else if (this.position[i].toString() === destEl.id) {
        this.position[i] = Number(originEl.id);
      }

    }

    this.printIndexes(this.position);
    this.steps++;
    this.gameComplete = this.isSorted(this.position);

  }

  allowDrop(event): void {
    event.preventDefault();
    event.target.style.opacity = 1;
  }

  printIndexes(sorts: number[]): void {
    let i: number = 0, ind: string = '';
    for (i = 0; i < sorts.length; i++) {
      ind += sorts[i].toString() + ' , ';
    }
    // Saurav: printing index to indentify index sequence
    console.log(ind);
  }

  startGame(): void {
    this.reset();
    this.initializeGame();
    this.breakImageParts();
    this.reRandomize();
  }

  reRandomize(): void {
    this.gameComplete = false;
    this.Image = this.randomize(this.Image);
  }

  breakImageParts(): void {
    for (this.index = 0; this.index < this.totalBoxes; this.index++) {
      const x: string = (this.boxSize * (this.index % this.colSize)) + '%';
      const y: string = (50 * Math.floor(this.index / this.colSize)) + '%';
      let img: ImageBox = new ImageBox();
      img.x_pos = x;
      img.y_pos = y;
      img.index = this.index;
      this.indexes.push(this.index);
      this.Image.push(img);
    }
    this.boxSize = this.imageSize / this.colSize;
  }

  initializeGame(): void {
    this.boxSize = 100 / (this.colSize - 1);
    this.index = 0;
    this.totalBoxes = this.colSize * this.rawSize;
  }

  reset(): void {
    this.Image = [];
    this.indexes = [];
    this.position = [];
  }
}

class ImageBox {
  x_pos: string;
  y_pos: string;
  index: number;
}
