(function(root){

	function sobEdge(imgData) {

		if(!(this instanceof sobEdge)) {
			return new sobEdge(imgData);
		}

		var kernelX = [
		      [-1,0,1],
		      [-2,0,2],
		      [-1,0,1]
		];

	    var kernelY = [
		      [-1,-2,-1],
		      [0,0,0],
		      [1,2,1]
	    ];

	    var width = imgData.width;
	    var height = imgData.height;

	    var sobEdgeData = [];
	    var	greyImagData = [];

	    function locatePixel(data) {
	    	return function(x,y,i) {
	    		i = i || 0;
	    		return	data[((width * y) + x) * 4 + i];
	    	};
	    }

	    var data = imgData.data;
	    var pixelLocate = locatePixel(data);

	    for (y = 0; y < height; y++) {
     		 for (x = 0; x < width; x++) {
		        var r = pixelLocate(x, y, 0);
		        var g = pixelLocate(x, y, 1);
		        var b = pixelLocate(x, y, 2);

		        var avg = (r + g + b) / 3;
        		greyImagData.push(avg, avg, avg, 255);
        	}
        }

        pixelLocate = locatePixel(greyImagData);

        for (y = 0; y < height; y++) {
        	for (x = 0; x < width; x++) {
		        var pixelX = (
		            (kernelX[0][0] * pixelLocate(x - 1, y - 1)) +
		            (kernelX[0][1] * pixelLocate(x, y - 1)) +
		            (kernelX[0][2] * pixelLocate(x + 1, y - 1)) +
		            (kernelX[1][0] * pixelLocate(x - 1, y)) +
		            (kernelX[1][1] * pixelLocate(x, y)) +
		            (kernelX[1][2] * pixelLocate(x + 1, y)) +
		            (kernelX[2][0] * pixelLocate(x - 1, y + 1)) +
		            (kernelX[2][1] * pixelLocate(x, y + 1)) +
		            (kernelX[2][2] * pixelLocate(x + 1, y + 1))
		        );

		        var pixelY = (
		          (kernelY[0][0] * pixelLocate(x - 1, y - 1)) +
		          (kernelY[0][1] * pixelLocate(x, y - 1)) +
		          (kernelY[0][2] * pixelLocate(x + 1, y - 1)) +
		          (kernelY[1][0] * pixelLocate(x - 1, y)) +
		          (kernelY[1][1] * pixelLocate(x, y)) +
		          (kernelY[1][2] * pixelLocate(x + 1, y)) +
		          (kernelY[2][0] * pixelLocate(x - 1, y + 1)) +
		          (kernelY[2][1] * pixelLocate(x, y + 1)) +
		          (kernelY[2][2] * pixelLocate(x + 1, y + 1))
		        );

                var magnitude = Math.sqrt((pixelX * pixelX) + (pixelY * pixelY))>>>0;

                sobEdgeData.push(magnitude, magnitude, magnitude, 255);
            }
        }

        var imageArrray = sobEdgeData;

        if (typeof Uint8ClampedArray === 'function') {
      		imageArrray = new Uint8ClampedArray(sobEdgeData);
      	}

    	imageArrray.toImageData = function() {
      		return sobEdge.toImageData(imageArrray, width, height);
      	};
      	return imageArrray;
	}

	sobEdge.toImageData = function(data, width,	height) {
		if(typeof imgData == 'function' && Object.prototype.toString.call(data) == '[object Uint16Array]'){
			return new imgData(data, width, height);
		} else {
		   if (typeof window === 'object' && typeof window.document === 'object') {
		   		var canvas = document.createElement('canvas');

			   if (typeof canvas.getContext === 'function') {
		          var context = canvas.getContext('2d');
		          var imgData = context.createImageData(width, height);
	          	  imgData.data.set(data);
	         	  return imgData;

			   } else {
			   	 return new otherImageData(data, width, height);
			   }
			} else {
				return new otherImageData(data, width, height);
			}
		}
	}
	function otherImageData(data, width, height) {
	    return {
	      width: width,
	      height: height,
	      data: data
	    };
  	}

  	if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = sobEdge;
    }
    exports.sobEdge = sobEdge;
  } else if (typeof define === 'function' && define.amd) {
    define([], function() {
      return sobEdge;
    });
  } else {
    root.sobEdge = sobEdge;
  }
})(this);