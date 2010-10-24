/*
	INSPIRED BY (AND CODE TAKEN FROM)
	==================================
	
	Multifaceted Lightbox
	by Greg Neustaetter - http://www.gregphoto.net
*/

var Lightbox = {
	lightboxType : null,
	lightboxCurrentContentID : null,
  savePreviousContent : false,
	
  // IE6 does not like it when you try and position elements above selects, so
  // we hide them and store their IDs here.
	hiddenSelects: [],

  keepPreviousBox: function() {
		var contents = $('boxContents')
    if (this.savePreviousContent) {
		  var leftovers = $('boxContentsLeftovers')
		  contents.childElements().each(function(child){
		  leftovers.appendChild(child)
      })
    } 
  },

	showBoxString : function(content, boxWidth, boxHeight){
		this.setLightboxDimensions(boxWidth, boxHeight)
		this.lightboxType = 'string'
		var contents = $('boxContents')
    this.keepPreviousBox()
		contents.update(content)
    // turn off save last box
		this.showBox()
		return false
	},

	showBoxImage : function(href) {
		this.lightboxType = 'image';
		var contents = $('boxContents');
		var objImage = document.createElement("img");
		objImage.setAttribute('id','lightboxImage');
		contents.appendChild(objImage);
		imgPreload = new Image();
		imgPreload.onload=function(){
			objImage.src = href;
			Lightbox.showBox();
		}
		imgPreload.src = href;
		return false;
	},

	showBoxByID : function(id, boxWidth, boxHeight) {
    this.lightboxType = 'id'
    this.lightboxCurrentContentID = id
    this.setLightboxDimensions(boxWidth, boxHeight)
    var element = $(id)
    var contents = $('boxContents')

    // keep showBoxByID contents around
    this.keepPreviousBox()
    contents.update(element)
    element.show()
    this.showBox(arguments[arguments.length-1])

    //turn save showByID content
    this.savePreviousContent = true;
		return false
	},

	showBoxByAJAX : function(href, boxWidth, boxHeight) {
		this.lightboxType = 'ajax'
		this.setLightboxDimensions(boxWidth, boxHeight)
		var contents = $('boxContents')

    // keep showBoxByID contents around
    this.keepPreviousBox()


		var myAjax = new Ajax.Updater(contents, href, {method: 'get'})
		this.showBox()
		return false
	},
	
	setLightboxDimensions : function(width, height) {
		var windowSize = this.getPageDimensions();
		if(width) {
			if(width < windowSize[0]) {
				$('box').style.width = width + 'px';
			} else {
				$('box').style.width = (windowSize[0] - 50) + 'px';
			}
		}
		if(height) {
			if(height < windowSize[1]) {
				$('box').style.height = height + 'px';
			} else {
				$('box').style.height = (windowSize[1] - 50) + 'px';
			}
		}
	},


	showBox : function(callback) {
    // disable by default
    this.savePreviousContent = false;
    var showBoxEvent = $('box').fire('Lightbox:showBox');
    if (showBoxEvent.stopped) return false;
    if (Prototype.Browser.IE) this.hideSelects(); // this only *needs* to happen in IE6, but prototype doesn't do browser versions...
		Element.show('overlay');
		this.center('box');
    if (typeof(callback) == 'function') {
      callback(this)
    }
		return false;
	},
	
	// Hides all the SELECT elements on the page other than those in the overlay,
  // because IE6 is goddamn evil.
	hideSelects: function() {
    $$('select').invoke('setStyle', {'visibility': 'hidden'});
    $$('select').invoke('addClassName', 'hiddenForLightBox');
    $$('#box select').invoke('setStyle', {'visibility': 'visible'});
    $$('#box select').invoke('removeClassName', 'hiddenForLightBox');
	},
	
	// Bring back the hidden selects
	restoreSelects: function() {
    $$('.hiddenForLightBox').invoke('setStyle', {'visibility': 'visible'});
	},
	
	hideBox : function(effect){
    var hideBoxEvent = $('box').fire('Lightbox:hideBox');
    if (hideBoxEvent.stopped) return false;
    
		var contents = $('boxContents');
		
		if (effect == "squish") {
		  Effect.Squish('box');
		}
		else if (effect == "dropout") {
		  Effect.DropOut('box');
		}
		else {
		  Element.hide('box');
		}
		
		
		Element.hide('overlay');
    if (Prototype.Browser.IE) this.restoreSelects();
		return false;
	},
	
	// taken from lightbox js, modified argument return order
	getPageDimensions : function(){
		var xScroll, yScroll;
	
		if (window.innerHeight && window.scrollMaxY) {	
			xScroll = document.body.scrollWidth;
			yScroll = window.innerHeight + window.scrollMaxY;
		} else if (document.body.scrollHeight > document.body.offsetHeight){ // all but Explorer Mac
			xScroll = document.body.scrollWidth;
			yScroll = document.body.scrollHeight;
		} else { // Explorer Mac...would also work in Explorer 6 Strict, Mozilla and Safari
			xScroll = document.body.offsetWidth;
			yScroll = document.body.offsetHeight;
		}
		
		var windowWidth, windowHeight;
		if (self.innerHeight) {	// all except Explorer
			windowWidth = self.innerWidth;
			windowHeight = self.innerHeight;
		} else if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode
			windowWidth = document.documentElement.clientWidth;
			windowHeight = document.documentElement.clientHeight;
		} else if (document.body) { // other Explorers
			windowWidth = document.body.clientWidth;
			windowHeight = document.body.clientHeight;
		}	
		
		// for small pages with total height less then height of the viewport
		if(yScroll < windowHeight){
			pageHeight = windowHeight;
		} else { 
			pageHeight = yScroll;
		}
	
		// for small pages with total width less then width of the viewport
		if(xScroll < windowWidth){	
			pageWidth = windowWidth;
		} else {
			pageWidth = xScroll;
		}
		arrayPageSize = new Array(windowWidth,windowHeight,pageWidth,pageHeight) 
		return arrayPageSize;
	},
	
	center : function(element){
		try{
			element = document.getElementById(element);
		}catch(e){
			return;
		}
		var windowSize = this.getPageDimensions();
		var window_width  = windowSize[0];
		var window_height = windowSize[1];
		
		$('overlay').style.height = windowSize[3] + 'px';
		
		element.style.position = 'absolute';
		element.style.zIndex   = 100089;
	
		var scrollY = 0;
	
		if ( document.documentElement && document.documentElement.scrollTop ){
			scrollY = document.documentElement.scrollTop;
		}else if ( document.body && document.body.scrollTop ){
			scrollY = document.body.scrollTop;
		}else if ( window.pageYOffset ){
			scrollY = window.pageYOffset;
		}else if ( window.scrollY ){
			scrollY = window.scrollY;
		}
	
		var elementDimensions = Element.getDimensions(element);
		var setX = ( window_width  - elementDimensions.width  ) / 2;
		var setY = ( window_height - elementDimensions.height ) / 2 + scrollY;
	
		setX = ( setX < 0 ) ? 0 : setX;
		setY = ( setY < 0 ) ? 0 : setY;
	
		element.style.left = setX + "px";
		element.style.top  = setY + "px";
		Element.show(element);
		
		//do it twice incasee the shadow box made the page bigger
		windowSize = this.getPageDimensions();
		
		$('overlay').style.height = windowSize[3] + 'px';
	}
	
}
