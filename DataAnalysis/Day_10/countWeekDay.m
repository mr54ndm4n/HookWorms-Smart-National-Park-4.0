function [ output_args ] = countWeekDay( dataInput )
%UNTITLED4 Summary of this function goes here
%   Detailed explanation goes here

% result = getAllSameWeek(building1retail,datetime(2013,1,10));
% data = movmean(building1retail.PowerkW, 48);
    data = dataInput;
    [temp,tempName] = weekday(data.Timestamp);
    data.dayName = temp;

    len = [0 0 0 0 0 0 0];


    for i=1:7
        temp = data(data.dayName == i,:);
        len(i) = ceil(size(temp,1)/96);
    end
%     nameDay = [
%         'Sunday',
%         'Monday',
%         'Tuesday',
%         'Wednesday',
%         'Thursday',
%         'Friday',
%         'Saturday'
%         ]
%     returnValue = [nameDay',len']
    output_args = len;


end

