#include <stdio.h>
#include <stdlib.h>
#include <float.h>

/* Constant declaration */
#define MAX_IMAGESIZE  1024  /* Maximum image size */
#define MAX_BRIGHTNESS  255 /* Maximum gray level */
#define GRAYLEVEL       256 /* No. of gray levels */
#define MAX_FILENAME    256 /* Filename length limit */
#define MAX_BUFFERSIZE  256


//--------------------------------------------------------------------

unsigned char in_img[MAX_IMAGESIZE][MAX_IMAGESIZE],  out_img[MAX_IMAGESIZE][MAX_IMAGESIZE];
int x_size1, x_size2, y_size1, y_size2;

//void load_img_matrix();
//void save_image_matrix();

void load_img_matrix(){

	char filename[MAX_FILENAME];
	char buffer[MAX_BUFFERSIZE];
  FILE *fp;
  int max_intensity;
  int x,y;

// Input file open

//printf("\n---------------------");
printf("input pgm filename (*.pgm):" );
scanf("%s", filename);

fp = fopen(filename,"rb");
//printf("working till here\n" );

if ( fp == NULL) {

  printf("file dosent exits\n");
  exit(1);
}

// checking the input file type P5

  fgets(buffer, MAX_BUFFERSIZE, fp);

    if (buffer[0] != 'P' || buffer[1] != '5') {
      printf("ERROR: not the correct file format\n");
      exit(1);
    }

  x_size1 = 0;
  y_size1 = 0;
  while (x_size1 == 0 || y_size1 == 0) {
    fgets(buffer, MAX_BUFFERSIZE, fp);
    if (buffer[0] != '#') {
      sscanf(buffer, "%d %d", &x_size1, &y_size1);
    }
  }
  max_intensity = 0;
  while (max_intensity == 0) {
    fgets(buffer, MAX_BUFFERSIZE, fp);
    if (buffer[0] != '#') {
      sscanf(buffer, "%d", &max_intensity);
    }
  }
  printf("\n Image width = %d, Image height = %d\n", x_size1, y_size1);
  printf(" Maximum gray level = %d\n\n",max_intensity);
  if (x_size1 > MAX_IMAGESIZE || y_size1 > MAX_IMAGESIZE) {
    printf("     Image size exceeds %d x %d\n\n",
	   MAX_IMAGESIZE, MAX_IMAGESIZE);
    printf(" Please use smaller images!\n\n");
    exit(1);
  }
  if (max_intensity != MAX_BRIGHTNESS) {
    printf("  Invalid value of maximum gray level!\n\n");
    exit(1);
  }
 for(y = 0; y<y_size1; y++){
   for(x = 0; x< x_size1; x++){
     in_img[y][x] =  (unsigned char)fgetc(fp);
   }
 }
   printf("-----Input Image Matrix Loaded-----\n\n");
   fclose(fp);
 }


 void save_image_matrix(){

   char filename[MAX_FILENAME];
   FILE *fp;
   int x,y;

   printf("Enter the name for output image (*.pgm):\n" );
   scanf("%s",filename );

   fp = fopen(filename,"wb");
   fputs("P5\n", fp);
   fprintf(fp, "%d %d\n", x_size2, y_size2);
   fprintf(fp, "%d\n", MAX_BRIGHTNESS);

   for(y = 0; y < y_size2; y++){
     for(x = 0; x<x_size2; x++){
       fputc(out_img[y][x], fp);

     }
   }

   printf("\n-----Output Image Saved-----\n\n");
fclose(fp);

 }

void sobel_edge_detection(){

  int weight[3][3] = {{ -1,  0,  1 },
		                  { -2,  0,  2 },
		                  { -1,  0,  1 }};
    double pixel_value;
    double min, max;
    int x,y;
    int i,j;

    /* Maximum values calculation after filtering*/
    printf("Now, filtering of input image is performed\n\n");
    min = DBL_MAX;
    max = -DBL_MAX;
    for (y = 1; y < y_size1 - 1; y++) {
      for (x = 1; x < x_size1 - 1; x++) {
        pixel_value = 0.0;
        for (j = -1; j <= 1; j++) {
  	    for (i = -1; i <= 1; i++) {
  	      pixel_value += weight[j + 1][i + 1] * in_img[y + j][x + i];
  	    }
        }
        if (pixel_value < min) min = pixel_value;
        if (pixel_value > max) max = pixel_value;
      }
    }
    if ((int)(max - min) == 0) {
      printf("Nothing exists!!!\n\n");
      exit(1);
    }

    /* Initialization of out_img[y][x] */
    x_size2 = x_size1;
    y_size2 = y_size1;
    for (y = 0; y < y_size2; y++) {
      for (x = 0; x < x_size2; x++) {
        out_img[y][x] = 0;
      }
    }
    /* Generation of out_img  */
    for (y = 1; y < y_size1 - 1; y++) {
      for (x = 1; x < x_size1 - 1; x++) {
        pixel_value = 0.0;
        for (j = -1; j <= 1; j++) {
  	    for (i = -1; i <= 1; i++) {
  	      pixel_value += weight[j + 1][i + 1] * in_img[y + j][x + i];
  	    }
        }
        pixel_value = MAX_BRIGHTNESS * (pixel_value - min) / (max - min);
        out_img[y][x] = (unsigned char)pixel_value;
      }
    }
  }

  int main( )
  {
    load_img_matrix( );   /* Input of image1 */
    sobel_edge_detection( );   /* Sobel filter is applied to image1 */
    save_image_matrix( );   /* Output of image2 */
    return 0;

}
