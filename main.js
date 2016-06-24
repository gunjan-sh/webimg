main = { 

 readImage: function (f){ // read image file
  f=f.item(0); 
  reader = new FileReader();
  reader.readAsDataURL(f);

  reader.onload=function(x){ // loading image
    var im = new Image();
    im.src=x.target.result; 

    im.onload = function(){
      var orgImage = document.createElement('canvas');
      orgImage.id = 'orgImage';
      // var div = document.getElementById('getimage');div.innerHTML='';
      // div.appendchild(orgImage);
      document.getElementById('imgstore').appendChild(orgImage)
      orgImage.width=this.width;orgImage.height=this.height;
      var context = orgImage.getContext('2d');
      context.drawImage(this,0,0);
      imData = context.getImageData(0,0,orgImage.width, orgImage.height);
      main.data.img= main.imData2data(imData);
      main.imwrite(orgImage,main.data.img)

     // var newImage=document.createElement('canvas');
        var newImage = document.getElementById('newImage');

      //newImage.id='newImage';
      newImage.width=orgImage.width;
      newImage.height=orgImage.height;
     // newImage.style.position='absolute';
     // newImage.style.left=orgImage.offsetLeft;newImage.style.top=orgImage.offsetTop;
      document.getElementById('Result').appendChild(newImage);

      var sobelData = sobEdge(imData);
      var sobelImageData = sobelData.toImageData();
      main.imwrite(newImage,sobelImageData);
    } // to make sure drawing only happens after loading

  };
  
},

image2canvas: function(event){
  var orgImage = document.getElementById('orgImage');
  var newImage = document.getElementById('newImage');
  //var image = event.target;

  newImage.width=orgImage.width;
  newImage.height=orgImage.height;

  var context = orgImage.getContext('2d');
  context.drawImage(this,0,0);
  imData = context.getImageData(0,0,orgImage.width, orgImage.height);

  return imData;
},

imData2data: function  (imData){ // imData is the data structure returned by canvas.getContext('2d').getImageData(0,0,n,m)
  var m=imData.width, n=imData.height, data=[];
  for (var i=0;i<n;i++){ //row
    data[i]=[];
    for (var j=0;j<m;j++){ // column
      ij=(i*m+j)*4;
      data[i][j]=[imData.data[ij],imData.data[ij+1],imData.data[ij+2],imData.data[ij+3]]
    }
  }
  return data;  
},

imwrite:function(cv,im,dx,dy){
  if(!dy){dx=0;dy=0} // default location
  if(typeof(cv)=='string'){cv=document.getElementById(cv)} //cv can also be the id of a canvas element
  if(!im.data){im=main.data2imData(im)} // such that im can also be the matrix created by imread
  var ct = cv.getContext('2d');
  ct.putImageData(im,dx,dy);
  return ct;
},
data:{
  // a good place to keep data that multiple modules may need
  // for example, loading an image will automatically create imagejs.data.img with the output of jmat.imread('work')
},
data2imData:function(data){ // the reverse of im2data, data is a matlabish set of 4 2d matrices, with the r, g, b and alpha values
  var n=data.length, m=data[0].length;
  //var imData = {width:m, height:n, data:[]};
  var imData = document.createElement('canvas').getContext('2d').createImageData(m,n);
  for (var i=0;i<n;i++){ //row
    //data.r[i]=[];data.g[i]=[];data.b[i]=[];data.a[i]=[];
    for (var j=0;j<m;j++){ // column
      ij=(i*m+j)*4;
      imData.data[ij]=data[i][j][0];
      imData.data[ij+1]=data[i][j][1];
      imData.data[ij+2]=data[i][j][2];
      imData.data[ij+3]=data[i][j][3];
    }
  }
  return imData;
},
};