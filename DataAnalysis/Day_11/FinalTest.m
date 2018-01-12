function varargout = FinalTest(varargin)
% FINALTEST MATLAB code for FinalTest.fig
%      FINALTEST, by itself, creates a new FINALTEST or raises the existing
%      singleton*.
%
%      H = FINALTEST returns the handle to a new FINALTEST or the handle to
%      the existing singleton*.
%
%      FINALTEST('CALLBACK',hObject,eventData,handles,...) calls the local
%      function named CALLBACK in FINALTEST.M with the given input arguments.
%
%      FINALTEST('Property','Value',...) creates a new FINALTEST or raises the
%      existing singleton*.  Starting from the left, property value pairs are
%      applied to the GUI before FinalTest_OpeningFcn gets called.  An
%      unrecognized property name or invalid value makes property application
%      stop.  All inputs are passed to FinalTest_OpeningFcn via varargin.
%
%      *See GUI Options on GUIDE's Tools menu.  Choose "GUI allows only one
%      instance to run (singleton)".
%
% See also: GUIDE, GUIDATA, GUIHANDLES

% Edit the above text to modify the response to help FinalTest

% Last Modified by GUIDE v2.5 12-Jan-2018 04:21:11

% Begin initialization code - DO NOT EDIT
gui_Singleton = 1;
gui_State = struct('gui_Name',       mfilename, ...
                   'gui_Singleton',  gui_Singleton, ...
                   'gui_OpeningFcn', @FinalTest_OpeningFcn, ...
                   'gui_OutputFcn',  @FinalTest_OutputFcn, ...
                   'gui_LayoutFcn',  [] , ...
                   'gui_Callback',   []);
if nargin && ischar(varargin{1})
    gui_State.gui_Callback = str2func(varargin{1});
end

if nargout
    [varargout{1:nargout}] = gui_mainfcn(gui_State, varargin{:});
else
    gui_mainfcn(gui_State, varargin{:});
end
% End initialization code - DO NOT EDIT


% --- Executes just before FinalTest is made visible.
function FinalTest_OpeningFcn(hObject, eventdata, handles, varargin)
% This function has no output args, see OutputFcn.
% hObject    handle to figure
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
% varargin   command line arguments to FinalTest (see VARARGIN)

% Choose default command line output for FinalTest
handles.output = hObject;
    %handles.Data = importfile('plotData.csv');
%     handles.outputData = importOutput('output.csv');
    handles.outputData = load('label.mat');
    handles.outputData = table2array(handles.outputData.output)
    handles.trainData = importTraindata2('Traindata.csv');
    T = timer;
    T.period = 0.5;
    T.ExecutionMode = 'fixedRate';
    T.TimerFcn = @Update_Fcn;
    handles.timer = T;
    
    T2 = timer;
    T2.period = 10;
    T2.ExecutionMode = 'fixedRate';
    T2.TimerFcn = @Update_Fcn2;
    handles.timer2 = T2;
    
    
    
    handles.chooseStartTime = '1100';
    handles.chooseEndTime = '1200';
    handles.chooseServer = '19';
   
    c = struct();
    c.idx = 1;
    c.linestyle1 = animatedline('Color','r');
    c.linestyle2 = animatedline('Color','b');
    c.linestyle3 = animatedline('Color','g');
    c.linestyle4 = animatedline('Color','b');
    c.linestyle5 = animatedline('Color','y');
    
handles.timer.UserData = c;
% Update handles structure
guidata(hObject, handles);

% UIWAIT makes FinalTest wait for user response (see UIRESUME)
% uiwait(handles.figure1);


% --- Outputs from this function are returned to the command line.
function varargout = FinalTest_OutputFcn(hObject, eventdata, handles) 
% varargout  cell array for returning output args (see VARARGOUT);
% hObject    handle to figure
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Get default command line output from handles structure
varargout{1} = handles.output;


% --- Executes on button press in ConnectIntervalbutton.
function ConnectIntervalbutton_Callback(hObject, eventdata, handles)
% hObject    handle to ConnectIntervalbutton (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
handles.Data = getDataFromServer( handles.chooseStartTime, handles.chooseEndTime, handles.chooseServer );
% clearpoints(handles.lin)
set(handles.TeamIDtext,'String','Data have recived');
guidata(hObject, handles);

% --- Executes on button press in TrainModelButton.
function TrainModelButton_Callback(hObject, eventdata, handles)
% hObject    handle to TrainModelButton (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
handles.NN = createNN(handles.trainData,handles.outputData);
g = handles.NN;
save('net.mat','g');

set(handles.CountStatusList,'String',getGroupCount(handles.outputData));
guidata(hObject, handles);



% --- Executes on selection change in CountStatusList.
function CountStatusList_Callback(hObject, eventdata, handles)
% hObject    handle to CountStatusList (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Hints: contents = cellstr(get(hObject,'String')) returns CountStatusList contents as cell array
%        contents{get(hObject,'Value')} returns selected item from CountStatusList


% --- Executes during object creation, after setting all properties.
function CountStatusList_CreateFcn(hObject, eventdata, handles)
% hObject    handle to CountStatusList (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    empty - handles not created until after all CreateFcns called

% Hint: listbox controls usually have a white background on Windows.
%       See ISPC and COMPUTER.
if ispc && isequal(get(hObject,'BackgroundColor'), get(0,'defaultUicontrolBackgroundColor'))
    set(hObject,'BackgroundColor','white');
end


% --- Executes on button press in ConnectSensorButton.
function ConnectSensorButton_Callback(hObject, eventdata, handles)
% hObject    handle to ConnectSensorButton (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
isPushed = get(hObject,'Value');

if isPushed 
    
    c = struct();
    c.NN = handles.NN;
    c.TeamID = handles.TeamID;
    c.CurrentStatusText = handles.CurrentStatusText;
    handles.timer2.UserData = c;
    
    start(handles.timer2);    
    set(hObject,'String','Sensor connecting');
    
else 
    set(hObject,'String','Connect Sensor');  
    stop(handles.timer2);
   
end
guidata(hObject, handles);

% --- Executes on button press in StartStop.
function StartStop_Callback(hObject, eventdata, handles)
% hObject    handle to StartStop (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
isPushed = get(hObject,'Value');

if isPushed 
    set(hObject,'String','Stop');
    c = handles.timer.UserData;    
    c.xData = datenum(handles.Data.date);
    c.yData = handles.Data.temp;
    c.yData2 = handles.Data.accX;
    c.yData3 = handles.Data.accY;
    c.yData4 = handles.Data.accZ;
    c.yData5 = handles.Data.din;    
    c.speed = 1;
    c.NN=handles.NN;
    c.Graph1 = handles.Graph1;
    c.runtext = handles.RunningStatusText;
    handles.timer.UserData = c;
    
    minimalY = min(min(cat(2,c.yData,c.yData2,c.yData3,c.yData4,c.yData5,c.yData2)));
    %datestr(min(c.xData));
    axis([min(c.xData), max(c.xData),minimalY-2, max(c.yData)+2 ])
    datetick(handles.Graph1,'x')
    start(handles.timer);
else 
    set(hObject,'String','Start');   
    stop(handles.timer);  
end
guidata(hObject, handles);




function StartTimetext_Callback(hObject, eventdata, handles)
% hObject    handle to StartTimetext (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Hints: get(hObject,'String') returns contents of StartTimetext as text
%        str2double(get(hObject,'String')) returns contents of StartTimetext as a double
handles.chooseStartTime = get(hObject,'String');
guidata(hObject, handles);



% --- Executes during object creation, after setting all properties.
function StartTimetext_CreateFcn(hObject, eventdata, handles)
% hObject    handle to StartTimetext (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    empty - handles not created until after all CreateFcns called

% Hint: edit controls usually have a white background on Windows.
%       See ISPC and COMPUTER.
if ispc && isequal(get(hObject,'BackgroundColor'), get(0,'defaultUicontrolBackgroundColor'))
    set(hObject,'BackgroundColor','white');
end



function EndTimeText_Callback(hObject, eventdata, handles)
% hObject    handle to EndTimeText (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Hints: get(hObject,'String') returns contents of EndTimeText as text
%        str2double(get(hObject,'String')) returns contents of EndTimeText as a double
handles.chooseEndTime = get(hObject,'String');
guidata(hObject, handles);

% --- Executes during object creation, after setting all properties.
function EndTimeText_CreateFcn(hObject, eventdata, handles)
% hObject    handle to EndTimeText (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    empty - handles not created until after all CreateFcns called

% Hint: edit controls usually have a white background on Windows.
%       See ISPC and COMPUTER.
if ispc && isequal(get(hObject,'BackgroundColor'), get(0,'defaultUicontrolBackgroundColor'))
    set(hObject,'BackgroundColor','white');
end



function Servertext_Callback(hObject, eventdata, handles)
% hObject    handle to Servertext (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Hints: get(hObject,'String') returns contents of Servertext as text
%        str2double(get(hObject,'String')) returns contents of Servertext as a double
handles.chooseServer = get(hObject,'String');
guidata(hObject, handles);

% --- Executes during object creation, after setting all properties.
function Servertext_CreateFcn(hObject, eventdata, handles)
% hObject    handle to Servertext (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    empty - handles not created until after all CreateFcns called

% Hint: edit controls usually have a white background on Windows.
%       See ISPC and COMPUTER.
if ispc && isequal(get(hObject,'BackgroundColor'), get(0,'defaultUicontrolBackgroundColor'))
    set(hObject,'BackgroundColor','white');
end

% --- Executes on slider movement.
function Speed_Callback(hObject, eventdata, handles)
% hObject    handle to Speed (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Hints: get(hObject,'Value') returns position of slider
%        get(hObject,'Min') and get(hObject,'Max') to determine range of slider
val= get(handles.Speed,'value');
vald=1;
if  val <= 1
     vald=1;
elseif val <= 7.9 
        vald=3;
elseif val <= 14.8
        vald=5;
elseif val <= 21.7
        vald=12;
elseif val <= 24
        vald=25;
end
    c = handles.timer.UserData;    
    c.speed = vald;
    handles.timer.UserData = c;
guidata(hObject, handles);

% --- Executes during object creation, after setting all properties.
function Speed_CreateFcn(hObject, eventdata, handles)
% hObject    handle to Speed (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    empty - handles not created until after all CreateFcns called
% Hint: slider controls usually have a light gray background.
if isequal(get(hObject,'BackgroundColor'), get(0,'defaultUicontrolBackgroundColor'))
    set(hObject,'BackgroundColor',[.9 .9 .9]);
end

function Update_Fcn2(obj, evt)   
disp('in2')
sensorData = getRealTime()


disp(sensorData(1,:))
url = 'http://10.0.0.54:3000/alert/';
sensorPredict =[sensorData.temp,sensorData.accX,sensorData.accY,sensorData.accZ,sensorData.din];
temp = obj.UserData;
strTeamIDAll = {};
strStatusAll = {};
for  c = 1:4 

    Predict = temp.NN(sensorPredict(c,:)')  
    if Predict(1,1) == max(Predict)
        strStatus = 'Forest Fire';
        response = webwrite(url,'team_id',sensorData.teamID(c),'description','Forest Fire')        
%         set(temp.TeamID,'String',sensorData.teamID(c));
%         set(temp.CurrentStatusText,'String',strStatus);


        
    elseif Predict(2,1) == max(Predict)
        strStatus = 'Falling Tree';
        response = webwrite(url,'team_id',sensorData.teamID(c),'description','Falling Tree')
%         set(temp.TeamID,'String',sensorData.teamID(c));
%         set(temp.CurrentStatusText,'String',strStatus);
%         break;
    elseif Predict(3,1) == max(Predict)
        strStatus = 'Elephat Through';
        response = webwrite(url,'team_id',sensorData.teamID(c),'description','Elephat Through')
%         set(temp.TeamID,'String',sensorData.teamID(c));
%         set(temp.CurrentStatusText,'String',strStatus);
%         break;
    elseif Predict(4,1) == max(Predict)
        strStatus = 'Well';
%         set(temp.CurrentStatusText,'String',strStatus);
    end
%     class(sensorData.teamID(c))
    if ~strcmp(strStatus,'Well')
        strTeamIDAll{c} = num2str(sensorData.teamID(c));
        strStatusAll{c} = strStatus;
    end

end

set(temp.TeamID,'String',sprintf('%s\n', strTeamIDAll{:}));
set(temp.CurrentStatusText,'String',sprintf('%s\n', strStatusAll{:}));


function Update_Fcn(obj, evt)
c = obj.UserData;

strStatus = 'Well';
for i = 1:c.speed
    if c.idx <= size(c.xData,1)
        x = c.xData(c.idx);
        y = c.yData(c.idx);
        y2 = c.yData2(c.idx);
        y3 = c.yData3(c.idx);
        y4 = c.yData4(c.idx);
        y5 = c.yData5(c.idx);
        addpoints(c.linestyle1, x, y);
        addpoints(c.linestyle2, x, y2);
        addpoints(c.linestyle3, x, y3);
        addpoints(c.linestyle4, x, y4);
        addpoints(c.linestyle5, x, y5);
        c.Predict = c.NN([y,y2,y3,y4,y5]');
        %disp(c.Predict);
        
            if c.Predict(1,1) == max(c.Predict)                
                change = ~strcmp(strStatus,'Forest Fire');
                strStatus = 'Forest Fire';
            elseif c.Predict(2,1) == max(c.Predict)                
                change = ~strcmp(strStatus,'Falling Tree');
                strStatus = 'Falling Tree';
            elseif c.Predict(3,1) == max(c.Predict)                
                change = ~strcmp(strStatus,'Elephat Through');
                strStatus = 'Elephat Through';
            elseif c.Predict(4,1) == max(c.Predict)
                change = ~strcmp(strStatus,'Well');
                strStatus = 'Well';
                
            end
        
        
        if change
            set(c.runtext,'String',strStatus);
%             text(c.Graph1,x,y,strStatus);
        end
        
    %   datetick(c.axes2,'x','keepticks','keeplimits')
        c.idx = c.idx + 1;
        obj.UserData = c;        
    else
        disp('stop')
        stop(obj);
      break
    end
end
drawnow
