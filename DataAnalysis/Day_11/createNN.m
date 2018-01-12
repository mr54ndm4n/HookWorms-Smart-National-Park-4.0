function [ output_args ] = createNN( dataInput,Target )
%UNTITLED6 Summary of this function goes here
%   Detailed explanation goes here

hiddenLayerSize = 10;
net = patternnet(hiddenLayerSize);

net.divideParam.trainRatio = 70/100;
net.divideParam.valRatio = 15/100;
net.divideParam.testRatio = 15/100;

[net,tr] = train(net, dataInput', Target');

output_args = net;

end

