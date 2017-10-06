var overlay=null;
var ctx=null;
var AugmentedRealityViewer = function(getPOI, options) {
    var self = this;
    this.poi = [];
    var maxDistance = 0, here, overlay, ctx;
    this.viewer;
    this.elements=[];
    this.myposition=null;
    $('#camera').unwrap();
    this.setViewer = function (element) {
	this.viewer = element;
	this.viewer.width = $(window).width();//element.offsetWidth;
	this.viewer.height = $(window).height();//element.offsetHeight;
	
	this.viewer.style.backgroundColor = "black";
	var container = document.createElement("div");
	container.style.position = "fixed";
	container.style.marginTop = container.style.marginBottom = container.style.marginLeft = container.style.marginRight = container.style.paddingTop = container.style.paddingBottom = container.style.paddingLeft = container.style.paddingRight = 0;

	overlay = document.createElement("canvas");
	overlay.width = this.viewer.width;
	overlay.height = this.viewer.height;
	
	overlay.style.position = 'fixed';
	overlay.style.top = overlay.style.left = 0;
	element.parentNode.replaceChild(container, element);
	container.appendChild(this.viewer);
	container.appendChild(overlay);
	ctx = overlay.getContext("2d");
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.font="15px Arial";
	ctx.fillStyle = "white";
	ctx.strokeStyle = "white";
	//ctx.rect(10, 100, 100, 20);

    };

    var alpha = null,  prevAlpha = null;


    this.addStream = function (stream) {
    	setPOIy();
    	return;
	var source;
	if (window.webkitURL) {
	    source = window.webkitURL.createObjectURL(stream);
	    self.viewer.autoplay = true;
	} else {
	    source = stream; 
	}
	if (self.viewer.mozSrcObject !== undefined) {
	    self.viewer.mozSrcObject = source;
	} else {
	    self.viewer.src = source;
	}
		self.viewer.play();     
		setPOIy();
    };

    function distance(pos1, pos2) {
		function toRad(n) {
		    return n * Math.PI / 180;
		}
		var R = 6371000; // m
		var dLat = toRad(pos2.latitude-pos1.latitude);
		var dLon = toRad(pos2.longitude - pos1.longitude);
		var lat1 = toRad(pos1.latitude);
		var lat2 = toRad(pos2.latitude);
		var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
	            Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
		var d = R * c;    
		return d;
    }

    function projectedPOI(here,obj) {
		var d = distance(here,obj);
		var objNorth = {latitude:obj.latitude,longitude:here.longitude};
		var dNorth = (here.latitude > obj.latitude ? - 1 : 1) * distance(here, objNorth);
		var angle = (360 + (here.longitude > obj.longitude ? -1 : 1) * Math.acos(dNorth/d) * 180 / Math.PI) % 360;
		return {distance:d, angle:angle, label:obj.label};
    }
     var i=0;
    this.setPosition = function (pos) {    		
			self.poi=[];
			self.elements=[];
			here = {"latitude":pos.coords.latitude,"longitude":pos.coords.longitude};
			self.myposition=here;
			$('#dir').html('lat: '+pos.coords.latitude+"<br>lon: "+pos.coords.longitude);
			$('#dir').append('<br>i :'+i);
				getPOI(here, function (data) {
				    for (var i = 0 ; i < data.length; i++) {
						var p = projectedPOI(here,data[i]);
						maxDistance = Math.max(maxDistance, p.distance);
						self.poi.push(p);
				    }			    
			    	setPOIy();
			});
				i++;
    };

    this.setOrientation = function (newalpha) {
		alpha = newalpha;
    }

    this. showDetail =function(i){
		var poi=self.poi[i];
		alert(poi.label);
	}

    function setPOIy() {
	if (here && self.viewer) {
	    	for (var i =0 ; i<self.poi.length; i++) {
			// Let's calculate the position on our overlay canvas
			// based on logarithmic scale of distance
			self.poi[i].y = overlay.height - Math.log(self.poi[i].distance) / Math.log(Math.pow(maxDistance, 1/ (overlay.height-15)));
	    }
	    	drawPOIInfo();		
	   }
    }


    var animation;
    function drawPOIInfo() {
    	self.elements=[];
    	
	if (prevAlpha === null || Math.abs(alpha - prevAlpha) > 1) {
	    prevAlpha = alpha;
	    ctx.clearRect(0,0,overlay.width,overlay.height);
	    console.log(self.poi.length);
	    for (var i =0 ; i<self.poi.length; i++) {
		// Based on direction of POI
		var x = overlay.width / 2 + ((360 + alpha - self.poi[i].angle) % 360)*16/9;		
		var y = self.poi[i].y;
		//ctx.beginPath();
		//ctx.moveTo(overlay.width / 2, overlay.height * 1.1);
		//ctx.lineTo(x,y);
		//ctx.stroke();
		
		var rx=(overlay.width / 2) + (x - overlay.width) / 2;
		var ry=overlay.height + (y - overlay.height)/2;


		//ctx.fillStyle = 'white';
		ctx.fillStyle = "rgba(169, 33, 35, 0.4)"; 
		//ctx.fillRect(rx,ry,160,40);
		var rectWidth = 260;
		var rectHeight = 50;

		var rect=[rx,ry,rectWidth,rectHeight];
		self.elements.push(rect);
		self.roundRect(ctx, rx, ry, rectWidth, rectHeight);
		ctx.stroke();
		ctx.font="18px Arial";
		ctx.fontWeight = 'bold';
		ctx.textAlign="center"; 
		ctx.textBaseline = "middle";
		ctx.fillStyle = 'white';	
		
		ctx.fillText(self.poi[i].label,rx+(rectWidth/2),ry+(rectHeight/2)-7);
		//ctx.fillText(self.poi[i].label,rx+50,ry+15);
		var dst=((self.poi[i].distance / 100) / 10)/1.609344;
		ctx.fontWeight = 'normal';
		ctx.font="13px Arial";
		ctx.fillText(dst.toFixed(2)+ ' miles away',rx+(rectWidth/2),ry+(rectHeight/2)+10);
		//ctx.fillText(Math.floor(self.poi[i].distance / 100) / 10 + 'km',(overlay.width / 2) + (x - overlay.width) / 2, overlay.height + (y - overlay.height)/2);
		//ctx.fillText(self.poi[i].label,x,y);
	    }

	    $(overlay).unbind("click");
	    $(overlay).unbind("touchstart");
		
		$(overlay).on('click touchstart',function(e) {
		    var x = e.offsetX,
		        y = e.offsetY;
		          for(var i=0;i<self.elements.length;i++) { // check whether:
		          		console.log(self.elements[i]);
				        if(x > self.elements[i][0]            // mouse x between x and x + width
				        && x < self.elements[i][0] + self.elements[i][2]
				        && y > self.elements[i][1]            // mouse y between y and y + height
				        && y < self.elements[i][1] + self.elements[i][3]
				        ) {
				            self.showDetail(i);
				        	//ctx.rect(self.elements[i][0],self.elements[i][1],self.elements[i][2],self.elements[i][3]);
				        	//ctx.fillStyle = "green";
							//ctx.strokeStyle = "green";
				        	//ctx.stroke();
				        	///ctx.strokeStyle = "white";
				        }
				    }

		    });

	}
	
	//animation = requestAnimationFrame(drawPOIInfo);
    }    

    // if options.remote is set, we don't try to capture the stream, orientation and geolocation — they'll be set externally
    if (!options || options.remote === false) {

    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
		//navigator.getUserMedia || (navigator.getUserMedia = navigator.mozGetUserMedia ||
		//			   navigator.webkitGetUserMedia || navigator.msGetUserMedia);
	
	if (navigator.getUserMedia) {
		setPOIy();
	    //navigator.getUserMedia({video:true, toString: function(){return 'video';}}, this.addStream, console.log);
	}	

	 var options = {enableHighAccuracy: true,timeout: 5000,maximumAge: 0,desiredAccuracy: 0, frequency: 1 };
	navigator.geolocation.watchPosition(self.setPosition,onError, options);
	window.addEventListener("deviceorientation", function(e) {
	    self.setOrientation(e.alpha);
	});    



    }



   this.roundRect = function(ctx, x, y, width, height, radius, fill, stroke) {
		  if (typeof stroke == 'undefined') {
		    stroke = true;
		  }
		  if (typeof radius === 'undefined') {
		    radius = 30;
		  }
		  if (typeof radius === 'number') {
		    radius = {tl: radius, tr: radius, br: radius, bl: radius};
		  } else {
		    var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
		    for (var side in defaultRadius) {
		      radius[side] = radius[side] || defaultRadius[side];
		    }
		  }
		  ctx.beginPath();
		  ctx.moveTo(x + radius.tl, y);
		  ctx.lineTo(x + width - radius.tr, y);
		  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
		  ctx.lineTo(x + width, y + height - radius.br);
		  ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
		  ctx.lineTo(x + radius.bl, y + height);
		  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
		  ctx.lineTo(x, y + radius.tl);
		  ctx.quadraticCurveTo(x, y, x + radius.tl, y);
		  ctx.closePath();
		  //if (fill) {
		    ctx.fill();
		  //}
		  if (stroke) {
		    ctx.stroke();
		  }

		}
};

 function onError(error) {
      //alert('code: '    + error.code    + '\n' +
      //      'message: ' + error.message + '\n');
      $('#errors').html('code: '+ error.code +' '+ 'message: ' + error.message);
}