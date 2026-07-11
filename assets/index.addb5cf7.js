var E=Object.defineProperty;var b=(n,u,r)=>u in n?E(n,u,{enumerable:!0,configurable:!0,writable:!0,value:r}):n[u]=r;var s=(n,u,r)=>(b(n,typeof u!="symbol"?u+"":u,r),r);(function(){const u=document.createElement("link").relList;if(u&&u.supports&&u.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))o(t);new MutationObserver(t=>{for(const e of t)if(e.type==="childList")for(const a of e.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&o(a)}).observe(document,{childList:!0,subtree:!0});function r(t){const e={};return t.integrity&&(e.integrity=t.integrity),t.referrerpolicy&&(e.referrerPolicy=t.referrerpolicy),t.crossorigin==="use-credentials"?e.credentials="include":t.crossorigin==="anonymous"?e.credentials="omit":e.credentials="same-origin",e}function o(t){if(t.ep)return;t.ep=!0;const e=r(t);fetch(t.href,e)}})();const d="navigation__button",h=document.getElementsByClassName(d);class m{constructor(u,r){s(this,"name");s(this,"buttonTitle");s(this,"htmlElement");const o=document.createElement("div");this.name=u,this.buttonTitle=r,this.htmlElement=o}createAboutSection(){return this.htmlElement.setAttribute("class","mono-paragraph"),this.htmlElement.innerText="\u0417\u0440\u043E\u0431\u0438\u0432 \u0446\u0435\u0439 \u0441\u0430\u0439\u0442",this}createArtSection(){const u=`
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
    </p></div>`;return this.htmlElement=document.createElement("div"),this.htmlElement.innerHTML=u,this}createParagraph(){const u=`
    <h2>\u041D\u0410\u0426\u0406\u041E\u041D\u0410\u041B\u042C\u041D\u0418\u0419 \u0413\u0406\u041C\u041D \u0423\u041A\u0420\u0410\u0407\u041D\u0418</h1><br />
    <h4>(\u041E\u0440\u0438\u0433\u0456\u043D\u0430\u043B\u044C\u043D\u0438\u0439 \u0432\u0456\u0440\u0448 \u041F\u0430\u0432\u043B\u0430 \u0427\u0443\u0431\u0438\u043D\u0441\u044C\u043A\u043E\u0433\u043E)</h4><br />
      <p class="mono-paragraph" id="poem">
        <br />
        \u0429\u0435 \u043D\u0435 \u0432\u043C\u0435\u0440\u043B\u0430 \u0423\u043A\u0440\u0430\u0457\u043D\u0430, \u0456 \u0441\u043B\u0430\u0432\u0430, \u0456 \u0432\u043E\u043B\u044F,<br />
        \u0429\u0435 \u043D\u0430\u043C, \u0431\u0440\u0430\u0442\u0442\u044F \u043C\u043E\u043B\u043E\u0434\u0456\u0457, \u0443\u0441\u043C\u0456\u0445\u043D\u0435\u0442\u044C\u0441\u044F \u0434\u043E\u043B\u044F.<br />
        \u0417\u0433\u0438\u043D\u0443\u0442\u044C \u043D\u0430\u0448\u0456 \u0432\u043E\u0440\u043E\u0436\u0435\u043D\u044C\u043A\u0438, \u044F\u043A \u0440\u043E\u0441\u0430 \u043D\u0430 \u0441\u043E\u043D\u0446\u0456,<br />
        \u0417\u0430\u043F\u0430\u043D\u0443\u0454\u043C \u0456 \u043C\u0438, \u0431\u0440\u0430\u0442\u0442\u044F, \u0443 \u0441\u0432\u043E\u0457\u0439 \u0441\u0442\u043E\u0440\u043E\u043D\u0446\u0456.<br />
        <br />
        \u0414\u0443\u0448\u0443, \u0442\u0456\u043B\u043E \u043C\u0438 \u043F\u043E\u043B\u043E\u0436\u0438\u043C \u0437\u0430 \u043D\u0430\u0448\u0443 \u0441\u0432\u043E\u0431\u043E\u0434\u0443.<br />
        \u0406 \u043F\u043E\u043A\u0430\u0436\u0435\u043C, \u0449\u043E \u043C\u0438, \u0431\u0440\u0430\u0442\u0442\u044F, \u043A\u043E\u0437\u0430\u0446\u044C\u043A\u043E\u0433\u043E \u0440\u043E\u0434\u0443.<br />
        <br />
        \u0421\u0442\u0430\u043D\u0435\u043C, \u0431\u0440\u0430\u0442\u0442\u044F, \u0432 \u0431\u0456\u0439 \u043A\u0440\u043E\u0432\u0430\u0432\u0438\u0439 \u0432\u0456\u0434 \u0421\u044F\u043D\u0443 \u0434\u043E \u0414\u043E\u043D\u0443<br />
        \u0412 \u0440\u0456\u0434\u043D\u0456\u043C \u043A\u0440\u0430\u044E \u043F\u0430\u043D\u0443\u0432\u0430\u0442\u0438 \u043D\u0435 \u0434\u0430\u043C\u043E \u043D\u0456\u043A\u043E\u043C\u0443;<br />
        \u0427\u043E\u0440\u043D\u0435 \u043C\u043E\u0440\u0435 \u0449\u0435 \u0432\u0441\u043C\u0456\u0445\u043D\u0435\u0442\u044C\u0441\u044F, \u0434\u0456\u0434 \u0414\u043D\u0456\u043F\u0440\u043E \u0437\u0440\u0430\u0434\u0456\u0454,<br />
        \u0429\u0435 \u0443 \u043D\u0430\u0448\u0456\u0439 \u0423\u043A\u0440\u0430\u0457\u043D\u0456 \u0434\u043E\u043B\u0435\u043D\u044C\u043A\u0430 \u043D\u0430\u0441\u043F\u0456\u0454.<br />
        <br />
        \u0410 \u0437\u0430\u0432\u0437\u044F\u0442\u0442\u044F, \u043F\u0440\u0430\u0446\u044F \u0449\u0438\u0440\u0430 \u0441\u0432\u043E\u0433\u043E \u0449\u0435 \u0434\u043E\u043A\u0430\u0436\u0435,<br />
        \u0429\u0435 \u0441\u044F \u0432\u043E\u043B\u0456 \u0432 \u0423\u043A\u0440\u0430\u0457\u043D\u0456 \u043F\u0456\u0441\u043D\u044C \u0433\u0443\u0447\u043D\u0430 \u0440\u043E\u0437\u043B\u044F\u0436\u0435,<br />
        \u0417\u0430 \u041A\u0430\u0440\u043F\u0430\u0442\u0438 \u0432\u0456\u0434\u043E\u0431'\u0454\u0442\u044C\u0441\u044F, \u0437\u0433\u043E\u043C\u043E\u043D\u0438\u0442\u044C \u0441\u0442\u0435\u043F\u0430\u043C\u0438,<br />
        \u0423\u043A\u0440\u0430\u0457\u043D\u0438 \u0441\u043B\u0430\u0432\u0430 \u0441\u0442\u0430\u043D\u0435 \u043F\u043E\u043C\u0456\u0436 \u043D\u0430\u0440\u043E\u0434\u0430\u043C\u0438.<br />
      </p>
    `;return this.htmlElement=document.createElement("div"),this.htmlElement.innerHTML=u,this}}const c=new m("About","\u0429\u043E\u0441\u044C \u043F\u0440\u043E \u043C\u0435\u043D\u0435").createAboutSection(),i=new m("Anthem","\u0414\u0435\u0440\u0436\u0430\u0432\u043D\u0438\u0439 \u0413\u0456\u043C\u043D \u0423\u043A\u0440\u0430\u0457\u043D\u0438").createParagraph(),l=new m("Empty","\u0442\u0432\u043E\u0440\u0447\u0456 \u0434\u043E\u0440\u043E\u0431\u043A\u0438").createArtSection();for(let n=0;n<h.length;n++){const u=[c,i,l],r=h[n];r.textContent=u[n].buttonTitle,r.addEventListener("click",function(){const o="navigation__button--current";if(this.classList.contains(o))return;document.getElementsByClassName(o)[0].classList.remove(o),this.classList.add(o);let e;switch(this.textContent){case c.buttonTitle:e=c.htmlElement;break;case i.buttonTitle:e=i.htmlElement;break;case l.buttonTitle:e=l.htmlElement;break}const a=document.getElementsByClassName("content")[0];a.innerHTML="",a.appendChild(e)})}
