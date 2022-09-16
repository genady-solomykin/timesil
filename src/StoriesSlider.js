
class StoriesSlider {
  constructor(element, options) {
    this.element = element;
    this.options = options;
    this.currentStory = 0;
    this.storiesIndexes = this.getInitialStoriesIndexes();
    this.muted = true;
    this.opened = false;
    this.init();
  }

  makeStoriesCircles() {
    this.storiesCircles = document.createElement("div");
    this.storiesCircles.classList.add("stories-cirle");
    let template = '<div class="container"><div class="stories-cirle-wrapper">';

    if (this.options?.stories?.constructor === Array ) {
      this.options.stories.forEach((story) => {
        template += this.getStoryCircleTemplate(story.name, story.photo);
      });
    }

    template += '</div></div>';

    this.storiesCircles.innerHTML = template;

    this.element.append(this.storiesCircles);

    [...this.storiesCircles.querySelectorAll('.stories-cirle-wrapper__circle')].forEach((circle, index) => {
      circle.addEventListener('click', () => {
        if(this.modal.classList.contains('stories-slider-none')) {
          this.modal.classList.remove('stories-slider-none');
        }

        if(!this.opened) {
          this.initEvents();
          this.opened = true;
        }

        this.modalSwiper.slideTo(index);
        this.playVideo();
      });
    });
  }

  makeStoriesModal(children) {
    if (children?.constructor !== String) return "";

    if (!this.modal) {
      this.modal = document.createElement("div");
      this.modal.classList.add("slider", "stories-slider-none");
      this.showGoods = document.createElement('div');
      this.showGoods.classList.add('show-goods');
      this.showGoods.innerHTML = this.getGoodsTemplate();
      this.mountedSound = document.createElement('div');
      this.mountedSound.classList.add('sound_muted');
      this.mountedSound.innerHTML = this.makeStoriesModalMuted();
      const closeButton = this.getModalCloseButton();

      const swiperElement = this.makeSwiperOnModal();

      swiperElement.querySelector(".swiper-wrapper").innerHTML = children;

      this.modal.append(swiperElement);
      this.modal.append(this.mountedSound);
      this.modal.append(closeButton);
      this.element.append(this.modal);
      this.modal.append(this.showGoods);
    }
  }

  closeModal() {
    this.pauseVideo();
    this.modal.classList.add('stories-slider-none');
  }
  
  // -------------------

  makeStoriesModalMuted() {
    return `
    <button class="player-wrapper__muted">
        <div class="player-wrapper__off-muted">
            <svg width="22" height="22" viewBox="0 0 20 20" fill="#fff" xmlns="http://www.w3.org/2000/svg"><path d="M13 0V9.93934L11.5 8.43934V3.17108L8.60617 5.54551L7.54036 4.4797L13 0Z"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M13 14.0438L17.9697 19.0304L19.0304 17.9697L1.55941 0.439579L0.498747 1.50024L4.31891 5.33333H0V14.6667H6.5L13 20V14.0438ZM11.5 12.5387V16.8289L7.03662 13.1667H1.5V6.83333H5.81384L11.5 12.5387Z"></path></svg>
            <span class="stories-modal__mute-label">Звук выключен</span>
        </div>
        <div class="player-wrapper__on-muted">
            <svg width="22" height="22" viewBox="0 0 20 20" fill="#fff" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.03662 13.1667L11.5 16.8289V3.17108L7.03662 6.83333H1.5V13.1667H7.03662ZM0 14.6667V5.33333H6.5L13 0V20L6.5 14.6667H0Z"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M19.75 10C19.75 12.412 18.6368 14.7895 16.4785 16.5776L15.5215 15.4224C17.3632 13.8968 18.25 11.9311 18.25 10C18.25 8.06887 17.3632 6.1032 15.5215 4.57756L16.4785 3.42244C18.6368 5.21051 19.75 7.58799 19.75 10Z"></path></svg>
            <span class="stories-modal__mute-label">Звук включен</span>
        </div>
    </button>
    `
  }

  // -------------------

  makeSwiperOnModal() {
    if (!window.Swiper) {
      throw new Error("Отсутствует Swiper");
    }

    const swiperMainElement = document.createElement("div");
    swiperMainElement.classList.add("stories-swiper");
    swiperMainElement.innerHTML = '<div class="swiper-wrapper"></div>';

    this.modalSwiper = new Swiper(swiperMainElement, {
      slidesPerView: this.options.stories.length,
      spaceBetween: 30,
      centeredSlides: true,
      noSwiping: true,
      noSwipingClass: "swiper-slide",
      lazyLoad: true,
      breakpoints: {
        // when window width is >= 320px
        320: {
          slidesPerView: 1,
          spaceBetween: 0
        },
        // when window width is >= 480px
        600: {
          slidesPerView: 1,
          spaceBetween: 10
        },
        // when window width is >= 640px
        992: {
          slidesPerView: 3,
          spaceBetween: 10
        },
        1120: {
          slidesPerView: 4,
          spaceBetween: 10
        }
      }
    });

    return swiperMainElement;
  }

  makeStoriesTemplate() {
    let template = "";

    if (this.options?.stories?.constructor === Array) {
      this.options.stories.forEach((story, index) => {
        let storyItems = "";

        if (story?.items?.constructor === Array) {
          const needItem = [...story.items].shift();

          storyItems += this.getStoryItemTemplate(story, needItem);
        }

        template += storyItems;
      });
    }

    return template;
  }

  getInitialStoriesIndexes() {
    const initial = {};

    this.options.stories.forEach((_story, index) => {
      initial[index] = 0;
    });

    return initial;
  }

  getStoryCircleTemplate(name, photo) {
    return `
    <div class="stories-cirle-wrapper__circle">
      <div class="stories-cirle-wrapper__picture">
        <img src="${photo}" alt="${name}"></img>
      </div>
      <div class="stories-cirle-wrapper__title">${name}</div>
    </div>`;
  }


  getStoryItemTemplate(story, item) {
    return `
      <div class="swiper-slide">
        <div class="player">
          <div class="player-wrapper">
              <div class="player-wrapper__timeline-wrp">
                ${this.getStoryItemTimelineTemplate(story)}
              </div>
              <div class="player-wrapper__nav">
                  <div class="player-wrapper__prev"></div>
                  <div class="player-wrapper__next"></div>
              </div>
              <div class="player-wrapper__chunk-wrp">
                ${this.getStoryItemTypeTemplate(item, story)}
              </div>
              <div class="player-wrapper__story-info">
                <div class="player-wrapper__story-info-picture" style="background-image: url('${story.photo}')"></div>
                <div class="player-wrapper__story-info-title">${story.name}</div>
                <div class="player-wrapper__story-info-date"></div>
              </div>
                ${this.preloader()}
                ${this.storiesTextUnderVideo()}
          </div>
        </div>
      </div>`;
  }


storiesTextUnderVideo() {
  return `
  <div class="stories-text-under-video">
    <div class="stories-text-under-video__show">Используемые товары</div>
    <div class="stories-text-under-video__hide">Скрыть товары</div>
  </div>
  `;
}

getStoryGoodsLinkTemplate(prod, name) {
    return `
      <div class="stories-goods">
          <a class="stories-goods__link" href="${prod}">${name}</a>
      </div>`;
  }


preloader() {
  return `
    <div class="lds-facebook">
      <div></div><div></div><div></div>
    </div>
  `;
}


  // getStoryGoodsDropdownTemplate() {
  //   return `
  //   <div class="global-visibility">
  //     <div class="global-visibility__name">
        
  //     </div>
  //   </div>`
  // }


  // getStoryGoodsDropdownTemplate() {
  //   return `
  //   <div class="stories-goods__dropdown">
  //     <div class="stories-goods__dropdown-content">
  //       Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe, hic!
  //     </div>
  //   </div>`
  // }

  getStoryItemTimelineTemplate(story) {
    let template = '';

    story.items.forEach(() => {
      template += `<div class="player-wrapper__timeline">
        <div class="player-wrapper__process"></div>
      </div>`;
    });

    return template;
  }


getGoodsTemplate() {
  return `
  <div class="player-wrapper__chunk-goods">
           <div class="player-wrapper__chunk-goods-wrp">
             <div class="player-wrapper__chunk-goods-wrp-item">
              <div class="player-wrapper__chunk-goods-wrp-content">
                  <div class="player-wrapper__chunk-goods-wrp-image">
                  <img src="https://goldapple.ru/media/catalog/product/cache/ebaf7e4f526a1a3673f650b7f4b7e282/2/0/2003198532306_1_uampgfpcnw8fnepp.jpg" alt=""></img>
                </div>
                <div class="player-wrapper__chunk-goods-wrp-type">Восстанавливающий крем с витаминным комплексом</div>
                <div class="player-wrapper__chunk-goods-wrp-description">Don't Touch My Skin</div>
                <div class="player-wrapper__chunk-goods-wrp-prices">
                <div class="player-wrapper__chunk-goods-wrp-price">262000₸</div>
                <div class="player-wrapper__chunk-goods-wrp-price_discount">160999₸</div>
              </div>
              </div>
             </div>
           </div>
     </div>`;
}


  
  getStoryItemTypeTemplate(item, story) {


    const typeFormat = item.url.slice(item.url.lastIndexOf('.') + 1);

    let template = '<div class="player-wrapper__chunk player-wrapper__chunk-active">';
    if (item.type == "video") {
      template += `
        <video class="player-wrapper__chunk-video" preload="metadata" playsinline ${this.muted ? 'muted': ''}>
          <source src="${item.url}" type="${item.type}/${typeFormat}">
        </video>
      `;
    }
    if (item.type == "image") {
      template += `<img src="${item.url}" alt="${item.type}"></img>`;
    }
   
    template += '</div>';

    return template;
  }

  getModalCloseButton() {
    const button = document.createElement("button");
    button.classList.add('close_strories')
    button.innerHTML = `<div class="close_strories_mark">
      <svg width="18" height="18" viewBox="0 0 18 18" fill="#fff" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.9394 9.00006L0.469727 1.53039L1.53039 0.469727L9.00006 7.9394L16.4697 0.469727L17.5304 1.53039L10.0607 9.00006L17.5304 16.4697L16.4697 17.5304L9.00006 10.0607L1.53039 17.5304L0.469727 16.4697L7.9394 9.00006Z"></path></svg>
    </div>`;
    button.onclick = this.closeModal;

    return button;
  }
  
  initEvents() {
    [...this.modalSwiper.wrapperEl.querySelectorAll('.swiper-slide')].forEach((storyElement, index) => {
      storyElement.querySelector('.player-wrapper__next').addEventListener('click', this.nextStoryItem);
      storyElement.querySelector('.player-wrapper__prev').addEventListener('click', this.prevStoryItem);
      storyElement.addEventListener('click', () => this.slideToStoryItem(index));
      // тут можно вызвать еще одну функцию на удержание пауза
    });

    this.modalSwiper.on('slideChange', () => {
      const activeIndex = this.modalSwiper.activeIndex;
      const prevIndex = this.modalSwiper.previousIndex;
      const activeElement = this.modalSwiper.slides[activeIndex];
      const prevElement = this.modalSwiper.slides[prevIndex];

      if(activeElement) {
        const video = activeElement.querySelector('video');

        if(video) {
          video.play();
        }
      }

      if(prevElement) {
        const video = prevElement.querySelector('video');

        if(video) {
          video.pause();
          video.currentTime = 0;
        }
      }
    });
  }


  playVideo() {
    const activeIndex = this.modalSwiper.activeIndex;
    const slides = this.modalSwiper.slides.length > 0 ? this.modalSwiper.slides : [...this.modalSwiper.wrapperEl.querySelectorAll('.swiper-slide')];
    const activeElement = slides[activeIndex];

    if(activeElement) {
      const video = activeElement.querySelector('video');

      if(video) {
        video.play();
      }
    }
  }

  pauseVideo() {
    const activeIndex = this.modalSwiper.activeIndex;
    const slides = this.modalSwiper.slides.length > 0 ? this.modalSwiper.slides : [...this.modalSwiper.wrapperEl.querySelectorAll('.swiper-slide')];
    const activeElement = slides[activeIndex];
    
    if(activeElement) {
      const video = activeElement.querySelector('video');

      if(video) {
        video.pause();
        video.currentTime = 0;
        console.log(1112222);
      }
    }
  }


  // здесь переключается сторис вперед
  nextStoryItem = (e) => {
    // console.log(e.target);
    
    if(!e.target.closest('.swiper-slide').classList.contains('swiper-slide-active')) return false;
    
    const playerWrapper = e.target.closest('.player-wrapper');
    const playerChunk = playerWrapper.querySelector('.player-wrapper__chunk-wrp');
    
    if(this.storiesIndexes[this.modalSwiper.activeIndex] < this.options.stories[this.modalSwiper.activeIndex].items.length - 1) {
      this.storiesIndexes[this.modalSwiper.activeIndex] += 1;
      
      playerChunk.innerHTML = this.getStoryItemTypeTemplate(this.options.stories[this.modalSwiper.activeIndex].items[this.storiesIndexes[this.modalSwiper.activeIndex]]);
         
      const video = playerChunk.querySelector('video');

      //переключаем плашки в право
      let AddtimeLine = e.target.parentNode.parentNode.querySelector('.player-wrapper__timeline').classList.add('player-wrapper__timeline-active');
      let timeLineActive = e.target.parentNode.parentNode.querySelector('.player-wrapper__timeline-active');
          if(timeLineActive.nextElementSibling) {
            timeLineActive.classList.remove('player-wrapper__timeline-active');
            timeLineActive.nextElementSibling.classList.add('player-wrapper__timeline-active');
          }

      // тут по клику получаем длительность видео
        if(video) {
          video.addEventListener('loadedmetadata', (e) => {
            let resDuration = e.target.duration.toFixed() + '000';
            let resDurationString = Number(resDuration);
              // console.log(resDurationString);
          });
        }
      
      
      if(video) {
        video.play();
      }
    }
    else if(this.storiesIndexes[this.modalSwiper.activeIndex] >= this.options.stories[this.modalSwiper.activeIndex].items.length - 1) {
      const video = playerChunk.querySelector('video');
      
      if(video) {
        video.pause();
      }

      if(this.modalSwiper.activeIndex == this.options.stories.length - 1) {
        this.closeModal();
      }
      else {
        this.modalSwiper.slideNext();
      }
    }

    e.stopPropagation();
  }

  // здесь переключается сторис назад
  prevStoryItem = (e) => {
    if(!e.target.closest('.swiper-slide').classList.contains('swiper-slide-active')) return false;

    const playerChunk = e.target.closest('.player-wrapper').querySelector('.player-wrapper__chunk-wrp');

    if(this.storiesIndexes[this.modalSwiper.activeIndex] !== 0) {
      this.storiesIndexes[this.modalSwiper.activeIndex] -= 1;

      playerChunk.innerHTML = this.getStoryItemTypeTemplate(this.options.stories[this.modalSwiper.activeIndex].items[this.storiesIndexes[this.modalSwiper.activeIndex]]);
      const video = playerChunk.querySelector('video');


        if(video) {
          video.play();
        }
    }
    else {
      const video = playerChunk.querySelector('video');

      if(video) {
        video.pause();
      }

      this.modalSwiper.slidePrev();
    }

    e.stopPropagation();
  }

//Получаем время
  getDataTime() {
    let toDay = new Date();
    let options = {
       month: 'short',
       day: 'numeric' 
      };
    let result = toDay.toLocaleString('ru', options);
    return result;
  }

  ifGonePage() {
    
    document.addEventListener("visibilitychange", function() {
      if (document.hidden) {
       const stopVideo = document.querySelectorAll('.player-wrapper__chunk-video');
              stopVideo.forEach(elm => {
                elm.pause();
              });
      } else {
        const stopVideo = document.querySelectorAll('.player-wrapper__chunk-video');
              stopVideo.forEach(elm => {
                elm.play();
              });
      }
    });
  }

  // anotherPage() {
  //   document.addEventListener("visibilitychange", function() {
  //     if (document.hidden) {
  //       let video = document.querySelector('video').pause();
  //     } else {
  //       let video = document.querySelector('video').play();    
  //     }
  //   });
    
  // }


  turnOnTurnoffSound() {
    let soundBtn = this.modal.querySelector('.player-wrapper__muted');
    let changeMuted = soundBtn;
    changeMuted.addEventListener('click', () => {
        this.muted = !this.muted;
        changeMuted.querySelector('.player-wrapper__on-muted').classList.toggle('change_on-muted');
        changeMuted.querySelector('.player-wrapper__off-muted').classList.toggle('change_off-muted');
        this.modalSwiper.slides.forEach((slide) => {
          const video = slide.querySelector('video');
          if(video) {
            video.muted = this.muted;
          }
        });
    });
  }

  slideToStoryItem(index) {
    if(this.modalSwiper.activeIndex == index) return false;
    this.modalSwiper.slideTo(index);
  }

  init() {
    this.makeStoriesCircles();
    this.getDataTime();
    this.preloader();
    // this.ifGonePage();
    // this.showChunkGoods();
    this.makeStoriesModal(this.makeStoriesTemplate());
    // this.anotherPage();
    //setTimeout(() => this.initEvents(), 1000)
    this.turnOnTurnoffSound();
  }
}

window.StoriesSlider = StoriesSlider;

export default StoriesSlider;
