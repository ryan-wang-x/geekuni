import { createElement, Component } from "./framework.js";

class Carousel extends Component {
  constructor() {
    super();
    this.attributes = Object.create(null);
  }

  setAttribute(name, value) {
    this.attributes[name] = value;
  }

  render() {
    this.root = document.createElement("div");
    this.root.classList.add("carousel");
    for (let record of this.attributes.src) {
      let child = document.createElement("div");
      child.style.backgroundImage = `url(${record})`;
      this.root.appendChild(child);
    }

    const autoRun = () => {
      let children = this.root.children;
      let nextIndex = (position + 1) % children.length;

      let current = children[position];
      let next = children[nextIndex];

      next.style.transition = "none";
      next.style.transform = `translateX(${100 - nextIndex * 100}%)`;

      setTimeout(() => {
        next.style.transition = "";
        current.style.transform = `translateX(${-100 - position * 100}%)`;
        next.style.transform = `translateX(${-nextIndex * 100}%)`;

        position = nextIndex;
      }, 16);
    };

    let position = 0;
    let currentInterval = setInterval(autoRun, 3000);

    this.root.addEventListener("mousedown", (event) => {
      clearInterval(currentInterval);
      let children = this.root.children;
      let startX = event.clientX;

      let move = (event1) => {
        // 拖动的距离
        let x = event1.clientX - startX;

        let current = position - (x - (x % 500)) / 500;

        // 把前一个和后一个位置设置好
        for (let offset of [-1, 0, 1]) {
          let pos = current + offset;
          // 循环取余技巧 使结果总为正
          pos = (pos + children.length) % children.length;

          children[pos].style.transition = "none";
          children[pos].style.transform = `translateX(${
            -pos * 500 + offset * 500 + (x % 500)
          }px)`;
        }
      };

      let up = (event2) => {
        currentInterval = setInterval(autoRun, 3000);
        let x = event2.clientX - startX;
        position = position - Math.round(x / 500);
        for (let offset of [
          0,
          -Math.sign(Math.round(x / 500) - x + 250 * Math.sign(x))
        ]) {
          let pos = position + offset;
          // 循环取余技巧 使结果总为正
          pos = (pos + children.length) % children.length;

          children[pos].style.transition = "";
          children[pos].style.transform = `translateX(${
            -pos * 500 + offset * 500
          }px)`;
        }
        document.removeEventListener("mousemove", move);
        document.removeEventListener("mouseup", up);
      };

      document.addEventListener("mousemove", move);
      document.addEventListener("mouseup", up);
    });

    return this.root;
  }

  mountTo(parent) {
    parent.appendChild(this.render());
  }
}

let images = [
  "https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg",
  "https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg",
  "https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg",
  "https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg"
];

let a = <Carousel src={images} />;

a.mountTo(document.body);
