#include<iostream>
#include<cmath>
#include<opencv2/imgproc/imgproc.hpp>
#include<opencv2/highgui/highgui.hpp>


using namespace std;
using namespace cv;

int xGrad(Mat image, int x, int y){

	int x_gradient = 0;

	x_gradient = image.at<uchar>(y-1, x-1)+  2*image.at<uchar>(y, x-1) + image.at<uchar>(y+1, x-1)- 
				 2*image.at<uchar>(y,x+1)- image.at<uchar>(y-1,x+1)- image.at<uchar>(y+1,x+1);

	return x_gradient;

}

int yGrad (Mat image, int x, int y){

	int y_gradient = 0;

	y_gradient = image.at<uchar>(y-1, x-1) + 2*image.at<uchar>(y-1, x) + image.at<uchar>(y-1, x+1) 
	-image.at<uchar>(y+1, x-1) - 2*image.at<uchar>(y+1, x) - image.at<uchar>(y+1, x+1);

	return y_gradient;

}


int main()
{
	Mat img, source, dest;
    int sum, gx, gy;
     
  	 	source = imread("lena.jpg", CV_LOAD_IMAGE_GRAYSCALE);
  	 	dest = source.clone();

  	 	if (!source.data)
  	 	{
  	 		return -1;
  	 	}

  	 	for(int y = 0; y < source.rows; y++)
            for(int x = 0; x < source.cols; x++)
                dest.at<uchar>(y,x) = 0.0;

        for(int y = 1; y < source.rows - 1; y++){
            for(int x = 1; x < source.cols - 1; x++){
                gx = xGrad(source, x, y);
                gy = yGrad(source, x, y);
                sum = abs(gx) + abs(gy);
                sum = sum > 255 ? 255:sum;
                sum = sum < 0 ? 0 : sum;
                dest.at<uchar>(y,x) = sum;
            }
        }

        namedWindow("final");
        imshow("final", dest);
 
        namedWindow("initial");
        imshow("initial", source);
 
      waitKey();


  	 


	return 0;
}
/* TO RUN THE FILE ===== 
g++ `pkg-config --cflags opencv` imgp.cpp `pkg-config --libs opencv` -o edge_dec

./edge_dec

*/ 
