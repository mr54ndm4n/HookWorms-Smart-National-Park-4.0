function [ output_args ] = predictNN( dataInput,temp ,isFilter )
%UNTITLED6 Summary of this function goes here
%   Detailed explanation goes here

hiddenLayerSize = 10;
net = fitnet(hiddenLayerSize);

net.divideParam.trainRatio = 70/100;
net.divideParam.valRatio = 15/100;
net.divideParam.testRatio = 15/100;

% input = [1,2,3];
% targets = [2,4,6];
data = dataInput;
data.TempC = (data.OATF - 32)/9*5;
hour = datevec(data.Timestamp);
[temp,tempName] = weekday(data.Timestamp);
data.dayNum = temp;

if strcmp(isFilter,'y')
    hour(:,4) = movmean(hour(:,4),24);
    data.TempC = movmean(data.TempC,24);
    data.dayNum = movmean(data.dayNum,24);
end
    

input = [data.TempC, hour(:,4), data.dayNum  ]';
targets = data.PowerkW';
[net,tr] = train(net, input, targets);

hourTest = clock;
d = datetime('today');
[temp,tempName] = weekday(d);
output_args = net([10;hourTest(4);temp]);

end

