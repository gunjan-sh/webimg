%% Algorithm
% 1. Read image
% 2. give a point from outside
% 3. find the euclidian distance of pixel level of RGB and get distanc matrix. 
% 4. find the max of the matrix 

clc;
clear all;
close all;

I1 = imread('im1.jpg');
I = im2double(I1);
J = imresize(I, 0.5);
imshow(J)

[x,y] = ginput(1);
x = int16(x)
y = int16(y)
q = J(x, y,1);
s= J(x,y,2);
t = J(x,y,3);

for i=1:size(J,1)
    for j=1:size(J,2)
        r = J(i, j, 1);
        g = J(i, j, 2);
        b = J(i, j,3);
        
        d = sqrt((q-r)^2 + (s-g)^2 + (t-b)^2);
        dist(i,j) = d;
    end
    
end

thresh = max(max(dist))./5;

J1 = im2uint8(J);

for i=1:size(J,1)
    for j=1:size(J,2)
        if dist(i,j) < thresh
            J(i,j,1) = 0;
            J(i,j,2) = 0;
            J(i,j,3) = 255;
        end
    end
end

imshow(J)


