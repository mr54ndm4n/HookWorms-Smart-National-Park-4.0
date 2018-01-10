function [ output_args ] = getAllSameWeek( inputData,dateInput )
%UNTITLED Summary of this function goes here
%   Detailed explanation goes here
%   d = datetime('today')
    inputData.week = week( inputData.Timestamp );
    inputData.Date = datevec(inputData.Timestamp);

    DateTarget = datevec(dateInput);

    cond1 = (inputData.Date(:,2) == DateTarget(2));
    cond2 = (inputData.Date(:,3) == DateTarget(3));
    dataDateOld = inputData( cond1 & cond2, :);
    weekTarget = dataDateOld(1,:).week;
    
    

    sameWeek = inputData( inputData.week == weekTarget ,:);
    
    % mean
    sameWeek.meanPow = movmean(sameWeek.PowerkW, 24);
    sameWeek.TempC = (sameWeek.OATF - 32)/9*5;
    sameWeek.TempC = movmean(sameWeek.TempC, 24);
    
    output_args = sameWeek;


end

