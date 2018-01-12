function [ output_arr ] = getGroupCount( targets )
%UNTITLED3 Summary of this function goes here
%   Detailed explanation goes here

count = [0 0 0 0];
count(1) = size(targets((targets(:,1) == 1)),1);
count(2) = size(targets((targets(:,2) == 1)),1);
count(3) = size(targets((targets(:,3) == 1)),1);
count(4) = size(targets((targets(:,4) == 1)),1);

CountArr = {
      strcat('Forest Fire = ',num2str(count(1))),
      strcat('Falling Tree =',num2str(count(2))),
      strcat('Elephat Through =',num2str(count(3))),
      strcat('Well =',num2str(count(4)))
       };


output_arr = CountArr;


end

