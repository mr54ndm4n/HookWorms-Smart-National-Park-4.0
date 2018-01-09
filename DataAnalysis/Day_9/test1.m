function varargout = test1(varargin)
% TEST1 MATLAB code for test1.fig
%      TEST1, by itself, creates a new TEST1 or raises the existing
%      singleton*.
%
%      H = TEST1 returns the handle to a new TEST1 or the handle to
%      the existing singleton*.
%
%      TEST1('CALLBACK',hObject,eventData,handles,...) calls the local
%      function named CALLBACK in TEST1.M with the given input arguments.
%
%      TEST1('Property','Value',...) creates a new TEST1 or raises the
%      existing singleton*.  Starting from the left, property value pairs are
%      applied to the GUI before test1_OpeningFcn gets called.  An
%      unrecognized property name or invalid value makes property application
%      stop.  All inputs are passed to test1_OpeningFcn via varargin.
%
%      *See GUI Options on GUIDE's Tools menu.  Choose "GUI allows only one
%      instance to run (singleton)".
%
% See also: GUIDE, GUIDATA, GUIHANDLES

% Edit the above text to modify the response to help test1

% Last Modified by GUIDE v2.5 09-Jan-2018 14:27:47

% Begin initialization code - DO NOT EDIT
gui_Singleton = 1;
gui_State = struct('gui_Name',       mfilename, ...
                   'gui_Singleton',  gui_Singleton, ...
                   'gui_OpeningFcn', @test1_OpeningFcn, ...
                   'gui_OutputFcn',  @test1_OutputFcn, ...
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


% --- Executes just before test1 is made visible.
function test1_OpeningFcn(hObject, eventdata, handles, varargin)
% This function has no output args, see OutputFcn.
% hObject    handle to figure
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
% varargin   command line arguments to test1 (see VARARGIN)

% Choose default command line output for test1

handles.output = hObject;


% Update handles structure
guidata(hObject, handles);

% UIWAIT makes test1 wait for user response (see UIRESUME)
% uiwait(handles.figure1);


% --- Outputs from this function are returned to the command line.
function varargout = test1_OutputFcn(hObject, eventdata, handles) 
% varargout  cell array for returning output args (see VARARGOUT);
% hObject    handle to figure
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Get default command line output from handles structure
varargout{1} = handles.output;


% --- Executes on button press in StartStop.
function StartStop_Callback(hObject, eventdata, handles)
% hObject    handle to StartStop (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Hint: get(hObject,'Value') returns toggle state of StartStop

isPushed = get(hObject,'Value');

if isPushed 
    set(hObject,'String','Stop');
    
%     handles.Data.Date = datevec( handles.Data.Timestamp) ;
%     cond = (handles.Data.Date(:,3) == 1);
%     cond = cond & (handles.Data.Date(:,2) == 2);
%     handles.dataWeek = handles.Data(cond, :);
    
    handles.dataWeek = handles.Data.Timestamp( week(handles.Data.Timestamp) == handles.chooseWeek );
    disp(handles.dataWeek)

    datenumber = datenum(handles.dataWeek);
    handles.datenumber = datenumber;
    handles.t = datenumber;
    
    test = handles.Data.PowerkW( week(handles.Data.Timestamp) == handles.chooseWeek );
    handles.y = test;
    

%     datenumber = datenum(handles.dataWeek.Timestamp);
%     handles.datenumber = datenumber
%     handles.t = datenumber;
%     handles.y = handles.dataWeek.PowerkW;
    
    
    c = struct();
    c.idx = 1;
    c.speed = handles.speedChoose * 4;
    c.xData = handles.t;
    c.yData = handles.y;
    c.axes2 = handles.axes2;
    an = animatedline;
    c.handle = an;
    handles.timer.UserData = c;
    
    axis(handles.axes2, [min(handles.datenumber) max(handles.datenumber) 0 max(handles.y) ])
    start(handles.timer);
    
else 
    set(hObject,'String','Start');
    stop(handles.timer);    
end
guidata(hObject, handles);

% --- Executes on slider movement.
function ChooseTimeSlider_Callback(hObject, eventdata, handles)
% hObject    handle to ChooseTimeSlider (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Hints: get(hObject,'Value') returns position of slider
%        get(hObject,'Min') and get(hObject,'Max') to determine range of slider

val= get(handles.ChooseTimeSlider,'value');
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
        vald=24;
end
set(handles.TimeDisplay,'String',vald);
handles.speedChoose = vald;
guidata(hObject, handles);

% --- Executes during object creation, after setting all properties.
function ChooseTimeSlider_CreateFcn(hObject, eventdata, handles)
% hObject    handle to ChooseTimeSlider (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    empty - handles not created until after all CreateFcns called

% Hint: slider controls usually have a light gray background.
if isequal(get(hObject,'BackgroundColor'), get(0,'defaultUicontrolBackgroundColor'))
    set(hObject,'BackgroundColor',[.9 .9 .9]);
    maxNumberOfImages = 168;
     
end



function WeekEditor_Callback(hObject, eventdata, handles)
% hObject    handle to WeekEditor (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Hints: get(hObject,'String') returns contents of WeekEditor as text
%        str2double(get(hObject,'String')) returns contents of WeekEditor as a double
handles.chooseWeek = str2double(get(hObject,'String'))
guidata(hObject, handles);

% --- Executes during object creation, after setting all properties.
function WeekEditor_CreateFcn(hObject, eventdata, handles)
% hObject    handle to WeekEditor (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    empty - handles not created until after all CreateFcns called

% Hint: edit controls usually have a white background on Windows.
%       See ISPC and COMPUTER.
if ispc && isequal(get(hObject,'BackgroundColor'), get(0,'defaultUicontrolBackgroundColor'))
    set(hObject,'BackgroundColor','white');
end



% --- Executes on button press in Selectbutton.
function Selectbutton_Callback(hObject, eventdata, handles)
% hObject    handle to Selectbutton (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
filename = uigetfile('*.*');
handles.Data= importfile(filename);
set(handles.FileName,'String',filename);

c = struct();
c.idx = 1;
% disp(handles.dataWeek)


T = timer;
T.period = 1;
T.ExecutionMode = 'fixedRate';
T.TimerFcn = @Update_Fcn;
handles.timer = T;





% plot(datenum(handles.dataWeek.Timestamp),handles.dataWeek.PowerkW)
% datetick(handles.axes2,'x','keepticks','keeplimits')

guidata(hObject, handles);


% Local function for updating graph
function Update_Fcn(obj, evt)
c = obj.UserData;
for i = 1:c.speed
    if c.idx <= size(c.xData,1)
        x = c.xData(c.idx);
        y = c.yData(c.idx);
        addpoints(c.handle, x, y);
        datetick(c.axes2,'x','keepticks','keeplimits')
        c.idx = c.idx + 1;
        obj.UserData = c;        
    else
        disp('stop')
        stop(obj);
        break
    end
end
drawnow
