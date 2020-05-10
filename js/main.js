
// Module pattern
const UIController = (function() {
  //declare private vars and functions
  const UISelectors = {
    carouselBtns   : '.carousel-btn',
    carouselInfos  : '.carousel-slide-info',
    webtraderBtn   : '#webtrader-btn',
    metatrader4Btn : '#metatrader4-btn',
    metatrader5Btn : '#metatrader5-btn',
    webtraderInfo  : '#webtrader-info',
    metatrader4Info: '#metatrader4-info',
    metatrader5Info: '#metatrader5-info',
    convertInput   : '#currency-amnt-input',
    convertSelect  : '#currency-select',
    convertBtn     : '#convert-btn',
    convertResult  : '#convert-result-input',
    convResCurrency : '#convert-result-currency',
    officeSelect    : '#office-select',
    jobSelect       : '#job-select'
  }

  const jobOpenings = [
    {
      country: "Cyprus",
      city: "Limassol",
      title: "Front End Developer",
    },
    {
      country: "Cyprus",
      city: "Limassol",
      title: "Back End Developer",
    },
    {
      country: "Cyprus",
      city: "Nicosia",
      title: "Accounting",
    },
    {
      country: "Cyprus",
      city: "Nicosia",
      title: "Financial Risk",
    },
    {
      country: "Greece",
      city: "Athens",
      title: "Android Developer",
    },
    {
      country: "Greece",
      city: "Athens",
      title: "Java Developer",
    },
  ];


  const breakpoint = {
    xsOnly  : false,
    smOnly  : false,
    smAndUp : false,
    mdOnly  : false,
    mdAndDown : false,
    mdAndUp : false,
    lgOnly  : false,
    lgAndUp : false,
    xlAndUp : false
  }
  

  const CalcBootstrapBreakpoint = () => {
    const windowWidth = window.innerWidth;

    if (windowWidth < 576) {
      breakpoint.xsOnly = true;
    }
    if (windowWidth >= 576 && windowWidth < 768) {
      breakpoint.smOnly = true;
    }

    if (windowWidth < 992) {
      breakpoint.mdAndDown = true;
    }

    if (windowWidth >= 768 && windowWidth < 992) {
      breakpoint.mdOnly = true;
    }

    if (windowWidth >= 992 && windowWidth < 1200) {
      breakpoint.lgOnly = true;
    }

    if (windowWidth >= 1200) {
      breakpoint.xlAndUp = true;
    }
    return breakpoint;
  }

  const InitCarousel = () => {
    $('#carousel').carousel({
      interval: 2000
    });  
    HandleCarouselSlideEvent();
    CalcBootstrapBreakpoint();
    
  }

  const HandleCarouselSlideEvent = () => {
    $('#carousel').on('slide.bs.carousel', e => {
      CustomizeCarouselButtons(e.to);
      CustomizeCarouselInfo(e.to)
      
    })
  }

  const CustomizeCarouselButtons = index => {
    Array.from($(UISelectors.carouselBtns)).forEach(button => {
      if (button.dataset.slide != index) {
        button.classList.remove('c-btn-red');
        button.classList.add('c-btn-light-grey');
      }
      else {
        button.classList.remove('c-btn-light-grey');
        button.classList.add('c-btn-red');
      }      
    });
  }

  const CustomizeCarouselInfo = index => { 
    Array.from($(UISelectors.carouselInfos)).forEach(infoArea => {
      /** Depending on the viewport size, we need
       * to either show all the info areas or, only
       * the one that corresponds to the currently active slide
       */
      if (breakpoint.mdAndDown) {
        if (infoArea.dataset.info != index) {
          infoArea.classList.add("d-none")
        }
        else {
          infoArea.classList.remove("d-none")
        }
      }
    });
    
  }

  const SlideCarousel = slideNo => {
    $('#carousel').carousel(slideNo);
  }

  const UpdateJobSelections = e => {
    let jobSelect = document.querySelector(UISelectors.jobSelect);
    let selectedLocation = e.target.value.toLowerCase();
    let jobs = jobOpenings.filter(job => job.city.toLowerCase() === selectedLocation);
    
    /** Set the jobs selection */
    jobSelect.options.length = 0;
    for (const job of jobs) {
      jobSelect.options[jobSelect.options.length] = new Option(job.title);
    }

  }

  return {
    // Declare public vars and functions
    initializeCarousel : InitCarousel,
    slideCarousel: SlideCarousel,
    calcBootstrapBreakpoint: CalcBootstrapBreakpoint,
    UpdateJobSelections,
    getSelectors: function(){
      return UISelectors;
    }
  }
})();

UIController.initializeCarousel();

/** App Controller */
const app = (function(UIController) {
  const UISelectors = UIController.getSelectors();
  const conversionRates = {
    USD : {
      EURO: 0.88
    },
    GBP : {
      EURO : 1.13
    }
  };

  const LoadEventListeners = function() {
    $(UISelectors.webtraderBtn).click(SlideCarousel);
    $(UISelectors.metatrader4Btn).click(SlideCarousel);
    $(UISelectors.metatrader5Btn).click(SlideCarousel);
    $(UISelectors.convertSelect).change(UpdateConversionCurrency);
    $(UISelectors.convertBtn).click(ConvertCurrency);
    $(UISelectors.officeSelect).change(UIController.UpdateJobSelections);

    window.onresize = UIController.calcBootstrapBreakpoint;
  }

  const SlideCarousel = function(e) {
    UIController.slideCarousel(Number(e.target.dataset.slide))
  }

  const UpdateConversionCurrency = e => {
    document.querySelector(UISelectors.convResCurrency).innerHTML = e.target.value;
  }

  const ConvertCurrency = e => {
    let inputAmount = Number(document.querySelector(UISelectors.convertInput).value) || 0;
    let selection = document.querySelector(UISelectors.convertSelect).value;

    const rate = conversionRates[selection].EURO;
    let result = inputAmount * rate;
    result = result.toFixed(2);

    document.querySelector(UISelectors.convertResult).value = result;
    e.preventDefault();
  }

  return { 
    init: function() {
      LoadEventListeners();
    }
  }

})(UIController);

app.init();