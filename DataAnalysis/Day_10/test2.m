function varargout = test2(varargin)
% TEST2 MATLAB code for test2.fig
%      TEST2, by itself, creates a new TEST2 or raises the existing
%      singleton*.
%
%      H = TEST2 returns the handle to a new TEST2 or the handle to
%      the existing singleton*.
%
%      TEST2('CALLBACK',hObject,eventData,handles,...) calls the local
%      function named CALLBACK in TEST2.M with the given input arguments.
%
%      TEST2('Property','Value',...) creates a new TEST2 or raises the
%      existing singleton*.  Starting from the left, property value pairs are
%      applied to the GUI before test2_OpeningFcn gets called.  An
%      unrecognized property name or invalid value makes property application
%      stop.  All inputs are passed to test2_OpeningFcn via varargin.
%
%      *See GUI Options on GUIDE's Tools menu.  Choose "GUI allows only one
%      instance to run (singleton)".
%
% See also: GUIDE, GUIDATA, GUIHANDLES

% Edit the above text to modify the response to help test2

% Last Modified by GUIDE v2.5 10-Jan-2018 16:39:54

% Begin initialization code - DO NOT EDIT
gui_Singleton = 1;
gui_State = struct('gui_Name',       mfilename, ...
                   'gui_Singleton',  gui_Singleton, ...
                   'gui_OpeningFcn', @test2_OpeningFcn, ...
                   'gui_OutputFcn',  @test2_OutputFcn, ...
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


% --- Executes just before test2 is made visible.
function test2_OpeningFcn(hObject, eventdata, handles, varargin)
% This function has no output args, see OutputFcn.
% hObject    handle to figure
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
% varargin   command line arguments to test2 (see VARARGIN)

% Choose default command line output for test2
handles.output = hObject;
handles.isfilter = 0;
handles.tempinput = 0;
% Update handles structure
guidata(hObject, handles);

% UIWAIT makes test2 wait for user response (see UIRESUME)
% uiwait(handles.figure1);


% --- Outputs from this function are returned to the command line.
function varargout = test2_OutputFcn(hObject, eventdata, handles) 
% varargout  cell array for returning output args (see VARARGOUT);
% hObject    handle to figure
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Get default command line output from handles structure
varargout{1} = handles.output;


% --- Executes on button press in TrainBoutton.
function TrainBoutton_Callback(hObject, eventdata, handles)
% hObject    handle to TrainBoutton (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
 set(handles.Predicbutton,'Enable','on')
 filename = uigetfile('*.*');
 handles.Data= importfile(filename);
 handles.Data.OATC=5/9*(handles.Data.OATF-32);
 set(handles.FilenameText,'String',filename);
 guidata(hObject, handles);

% --- Executes on selection change in DayListbox.
function DayListbox_Callback(hObject, eventdata, handles)
% hObject    handle to DayListbox (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Hints: contents = cellstr(get(hObject,'String')) returns DayListbox contents as cell array
%        contents{get(hObject,'Value')} returns selected item from DayListbox


% --- Executes during object creation, after setting all properties.
function DayListbox_CreateFcn(hObject, eventdata, handles)
% hObject    handle to DayListbox (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    empty - handles not created until after all CreateFcns called

% Hint: listbox controls usually have a white background on Windows.
%       See ISPC and COMPUTER.
if ispc && isequal(get(hObject,'BackgroundColor'), get(0,'defaultUicontrolBackgroundColor'))
    set(hObject,'BackgroundColor','white');
end



function TempForm_Callback(hObject, eventdata, handles)
% hObject    handle to TempForm (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Hints: get(hObject,'String') returns contents of TempForm as text
%        str2double(get(hObject,'String')) returns contents of TempForm as a double
handles.tempinput=str2double(get(hObject,'String'));
guidata(hObject, handles);


% --- Executes during object creation, after setting all properties.
function TempForm_CreateFcn(hObject, eventdata, handles)
% hObject    handle to TempForm (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    empty - handles not created until after all CreateFcns called

% Hint: edit controls usually have a white background on Windows.
%       See ISPC and COMPUTER.
if ispc && isequal(get(hObject,'BackgroundColor'), get(0,'defaultUicontrolBackgroundColor'))
    set(hObject,'BackgroundColor','white');
end


% --- Executes on button press in FilterButton.
function FilterButton_Callback(hObject, eventdata, handles)
% hObject    handle to FilterButton (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Hint: get(hObject,'Value') returns toggle state of FilterButton
handles.isfilter = get(hObject,'Value');
 guidata(hObject, handles);

% --- Executes on button press in Predicbutton.
function Predicbutton_Callback(hObject, eventdata, handles)
% hObject    handle to Predicbutton (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
set(handles.temptext,'String',mean(handles.Data.OATC));
set(handles.powertext,'String',mean(handles.Data.PowerkW));
CountWeekDay = countWeekDay(handles.Data)

arrday = {strcat('Sunday = ',num2str(CountWeekDay(1))),
          strcat('Monday =',num2str(CountWeekDay(2))),
          strcat('Tuseday =',num2str(CountWeekDay(3))),
          strcat('Wednesday =',num2str(CountWeekDay(4))),
          strcat('Thursday =',num2str(CountWeekDay(5))),
          strcat('Friday =',num2str(CountWeekDay(6))),
          strcat('Saturday =',num2str(CountWeekDay(7)))
    }
set(handles.DayListbox,'String',arrday);


temp = getAllSameWeek(handles.Data,datetime('today'));
plot(handles.Rightgrap,temp.Timestamp, temp.meanPow);
plot(handles.Leftgrap,temp.Timestamp, temp.TempC);

if handles.isfilter==1
    fil = 'y';
else 
    fil = 'n';
end    

set(handles.totalpowertext,'String',predictNN( handles.Data,handles.tempinput,fil ));


% Hint: get(hObject,'Value') returns toggle state of Predicbutton
