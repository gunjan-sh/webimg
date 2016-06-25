close all;
clc;
img=imread('lena.jpg');
B=rgb2gray(img);
figure, imshow(B)
I=double(B);

for i=1:size(I,1)-2
    for j=1:size(I,2)-2
        %Sobel mask for x-direction:
        mx=((2*I(i+2,j+1)+I(i+2,j)+I(i+2,j+2))-(2*I(i,j+1)+I(i,j)+I(i,j+2)));
        %Sobel mask for y-direction:
        my=((2*I(i+1,j+2)+I(i,j+2)+I(i+2,j+2))-(2*I(i+1,j)+I(i,j)+I(i+2,j)));
        
        B(i,j)=sqrt(mx.^2+my.^2);
    end
end

figure, imshow(B); title('Sobel gradient');
