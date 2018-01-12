function [ output_args ] = getRealTime(  )
%UNTITLED5 Summary of this function goes here
%   Detailed explanation goes here
options = weboptions('Timeout', 10);
teamID = [ 19 25 31 30];
sensor = {'temperature','accelerometer','din1'};
k = 1;
for i = 1:size(teamID,2)
    for j = 1:size(sensor,2)    
        url = ['http://10.0.0.10/api/',sensor{j},'/',int2str(teamID(i)),'/1'];
        response = webread(url, options);
        
    
            if strcmp('temperature', sensor(j)) 
               temp(k) = response.data.val;
            elseif strcmp('din1', sensor(j))            
               din(k) = response.data.val;
            elseif strcmp('accelerometer', sensor(j))                
               accX(k) = response.data.val_x;
               accY(k) = response.data.val_y;
               accZ(k) = response.data.val_z;
            end     
            
    end 
    k = k+1;
end

T = table(teamID(1:k-1)', temp', din', accX', accY', accZ');
T.Properties.VariableNames = {'teamID','temp','din','accX','accY','accZ'};
output_args = T;

end

