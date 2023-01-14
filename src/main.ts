const navigationButtonClass = "navigation__button";
const navigationButtons = document.getElementsByClassName(
  navigationButtonClass
);

class InfopageSection {
  name: string;
  buttonTitle: string;
  htmlElement: HTMLElement;
  constructor(name: string, buttonTitle: string) {
    const newElement = document.createElement("div");
    this.name = name;
    this.buttonTitle = buttonTitle;
    this.htmlElement = newElement;
  }
  createAboutSection() {
    this.htmlElement.setAttribute("class", "mono-paragraph");
    this.htmlElement.innerText = "Зробив цей сайт";
    return this;
  }
  createArtSection() {
    const sketchfabEmbed = `
    <div class="sketchfab-embed-wrapper"> 
    <iframe title="Cursed Skull" 
      width="600" height="500"
      frameborder="1" 
      allowfullscreen mozallowfullscreen="true" webkitallowfullscreen="true" 
      allow="autoplay; fullscreen; xr-spatial-tracking" xr-spatial-tracking 
      execution-while-out-of-viewport execution-while-not-rendered web-share 
      src="https://sketchfab.com/models/6c5d834846eb41318f854a66c1f9f8b9/embed?autostart=1&ui_theme=dark"> 
    </iframe> 
    <p style="font-size: 13px; font-weight: normal; margin: 5px; color: #4A4A4A;"> 
      <a href="https://sketchfab.com/3d-models/cursed-skull-6c5d834846eb41318f854a66c1f9f8b9?utm_medium=embed&utm_campaign=share-popup&utm_content=6c5d834846eb41318f854a66c1f9f8b9" target="_blank" style="font-weight: bold; color: #1CAAD9;"> Cursed Skull </a> by 
      <a href="https://sketchfab.com/carvincake?utm_medium=embed&utm_campaign=share-popup&utm_content=6c5d834846eb41318f854a66c1f9f8b9" target="_blank" style="font-weight: bold; color: #1CAAD9;"> Arseny </a> on <a href="https://sketchfab.com?utm_medium=embed&utm_campaign=share-popup&utm_content=6c5d834846eb41318f854a66c1f9f8b9" target="_blank" style="font-weight: bold; color: #1CAAD9;">Sketchfab</a>
    </p></div>`;
    this.htmlElement = document.createElement("div");
    this.htmlElement.innerHTML = sketchfabEmbed;
    return this;
  }
  createParagraph() {
    const anthemText = `
    <h2>НАЦІОНАЛЬНИЙ ГІМН УКРАЇНИ</h1><br />
    <h4>(Оригінальний вірш Павла Чубинського)</h4><br />
      <p class="mono-paragraph" id="poem">
        <br />
        Ще не вмерла Україна, і слава, і воля,<br />
        Ще нам, браття молодії, усміхнеться доля.<br />
        Згинуть наші вороженьки, як роса на сонці,<br />
        Запануєм і ми, браття, у своїй сторонці.<br />
        <br />
        Душу, тіло ми положим за нашу свободу.<br />
        І покажем, що ми, браття, козацького роду.<br />
        <br />
        Станем, браття, в бій кровавий від Сяну до Дону<br />
        В ріднім краю панувати не дамо нікому;<br />
        Чорне море ще всміхнеться, дід Дніпро зрадіє,<br />
        Ще у нашій Україні доленька наспіє.<br />
        <br />
        А завзяття, праця щира свого ще докаже,<br />
        Ще ся волі в Україні піснь гучна розляже,<br />
        За Карпати відоб'ється, згомонить степами,<br />
        України слава стане поміж народами.<br />
      </p>
    `;
    this.htmlElement = document.createElement("div");
    this.htmlElement.innerHTML = anthemText;
    return this;
  }
}

const aboutSection = new InfopageSection(
  "About",
  "Щось про мене"
).createAboutSection();
const anthemSection = new InfopageSection(
  "Anthem",
  "Державний Гімн України"
).createParagraph();
const artSection = new InfopageSection(
  "Empty",
  "творчі доробки"
).createArtSection();

for (let i = 0; i < navigationButtons.length; i++) {
  const NavigationSection = [aboutSection, anthemSection, artSection];
  const button = navigationButtons[i];
  button.textContent = NavigationSection[i].buttonTitle;
  button.addEventListener("click", function (this: typeof button) {
    const activeButtonClass = "navigation__button--current";
    if (this.classList.contains(activeButtonClass)) return;
    const currentButton = document.getElementsByClassName(activeButtonClass);
    currentButton[0].classList.remove(activeButtonClass);
    this.classList.add(activeButtonClass);
    let newSection: HTMLElement;
    switch (this.textContent) {
      case aboutSection.buttonTitle:
        newSection = aboutSection.htmlElement;
        break;
      case anthemSection.buttonTitle:
        newSection = anthemSection.htmlElement;
        break;
      case artSection.buttonTitle:
        newSection = artSection.htmlElement;
        break;
      default:
        break;
    }
    const content = document.getElementsByClassName("content")[0];
    content.innerHTML = "";
    content.appendChild(newSection);
  });
}

export {};
