function [ output_args ] = getDataFromServer( startDate, endDate,teamID  )
%UNTITLED5 Summary of this function goes here
%   Detailed explanation goes here
url = ['http://10.0.0.54:3000/allTeamSensor/',startDate,'/',endDate];
response = webread(url);
formatTxt = 'yyyy-MM-dd''T''HH:mm:ss.000''Z';

for i=1:size(response.din1,1)
    if strcmp(response.din1(i).teamID,teamID)
       tempValue(i) = str2num(response.temperature(i).val);
       temp2Value(i) = str2num(response.din1(i).val);

       xArray(i) = str2num(response.accelerometer(i).val_x);
       yArray(i) = str2num(response.accelerometer(i).val_y);
       zArray(i) = str2num(response.accelerometer(i).val_z);
       strDate = response.accelerometer(i).date;       
       temp = datenum( datetime(strDate,'InputFormat',formatTxt) );
       dateArray(i) = addtodate(temp, 7, 'hour');

    end
end

T = table(datestr(dateArray'), tempValue',temp2Value', xArray', yArray', zArray');
T.Properties.VariableNames = {'date','temp','din','accX','accY','accZ'};
T = sortrows(T,'date','ascend');

output_args = T;


end

