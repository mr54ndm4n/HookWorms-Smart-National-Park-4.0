 /*
 / _____)             _              | |
( (____  _____ ____ _| |_ _____  ____| |__
 \____ \| ___ |    (_   _) ___ |/ ___)  _ \
 _____) ) ____| | | || |_| ____( (___| | | |
(______/|_____)_|_|_| \__)_____)\____)_| |_|
    (C)2013 Semtech

Description: Generic lora driver implementation

License: Revised BSD License, see LICENSE.TXT file include in the project

Maintainer: Miguel Luis, Gregory Cristian and Wael Guibene
*/
/******************************************************************************
  * @file    main.c
  * @author  MCD Application Team
  * @version V1.1.0
  * @date    27-February-2017
  * @brief   this is the main!
  ******************************************************************************
  * @attention
  *
  * <h2><center>&copy; Copyright (c) 2017 STMicroelectronics International N.V. 
  * All rights reserved.</center></h2>
  *
  * Redistribution and use in source and binary forms, with or without 
  * modification, are permitted, provided that the following conditions are met:
  *
  * 1. Redistribution of source code must retain the above copyright notice, 
  *    this list of conditions and the following disclaimer.
  * 2. Redistributions in binary form must reproduce the above copyright notice,
  *    this list of conditions and the following disclaimer in the documentation
  *    and/or other materials provided with the distribution.
  * 3. Neither the name of STMicroelectronics nor the names of other 
  *    contributors to this software may be used to endorse or promote products 
  *    derived from this software without specific written permission.
  * 4. This software, including modifications and/or derivative works of this 
  *    software, must execute solely and exclusively on microcontroller or
  *    microprocessor devices manufactured by or for STMicroelectronics.
  * 5. Redistribution and use of this software other than as permitted under 
  *    this license is void and will automatically terminate your rights under 
  *    this license. 
  *
  * THIS SOFTWARE IS PROVIDED BY STMICROELECTRONICS AND CONTRIBUTORS "AS IS" 
  * AND ANY EXPRESS, IMPLIED OR STATUTORY WARRANTIES, INCLUDING, BUT NOT 
  * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A 
  * PARTICULAR PURPOSE AND NON-INFRINGEMENT OF THIRD PARTY INTELLECTUAL PROPERTY
  * RIGHTS ARE DISCLAIMED TO THE FULLEST EXTENT PERMITTED BY LAW. IN NO EVENT 
  * SHALL STMICROELECTRONICS OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
  * INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
  * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, 
  * OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF 
  * LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING 
  * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
  * EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
  *
  ******************************************************************************
  */

/* Includes ------------------------------------------------------------------*/
#include "hw.h"
#include "low_power.h"
#include "lora.h"
#include "bsp.h"
#include "timeServer.h"
#include "vcom.h"
#include "version.h"
#include "sensor.h"

/* Private typedef -----------------------------------------------------------*/
/* Private define ------------------------------------------------------------*/
/*!
 * CAYENNE_LPP is myDevices Application server.
 */
#define CAYENNE_LPP
#define LPP_DATATYPE_DIGITAL_INPUT  0x0
#define LPP_DATATYPE_DIGITAL_OUTPUT 0x1
#define LPP_DATATYPE_ANALOG_INPUT   0x2
#define LPP_DATATYPE_HUMIDITY       0x68
#define LPP_DATATYPE_TEMPERATURE    0x67
#define LPP_DATATYPE_BAROMETER      0x73


#define LPP_APP_PORT 99

/*!
 * Defines the application data transmission duty cycle. 15s, value in [ms].
 */
#define APP_TX_DUTYCYCLE                            35000
/*!
 * LoRaWAN Adaptive Data Rate
 * @note Please note that when ADR is enabled the end-device should be static
 */
#define LORAWAN_ADR_ON                              1
/*!
 * LoRaWAN confirmed messages
 */
#define LORAWAN_CONFIRMED_MSG                    DISABLE
/*!
 * LoRaWAN application port
 * @note do not use 224. It is reserved for certification
 */
#define LORAWAN_APP_PORT                            2

/* Private macro -------------------------------------------------------------*/
/* Private function prototypes -----------------------------------------------*/

/* call back when LoRa will transmit a frame*/
static void LoraTxData( lora_AppData_t *AppData, FunctionalState* IsTxConfirmed);

/* call back when LoRa has received a frame*/
static void LoraRxData( lora_AppData_t *AppData);

/* Private variables ---------------------------------------------------------*/
/* load call backs*/
static LoRaMainCallback_t LoRaMainCallbacks ={ HW_GetBatteryLevel,
                                               HW_GetUniqueId,
                                               HW_GetRandomSeed,
                                               LoraTxData,
                                               LoraRxData};

/*!
 * Specifies the state of the application LED
 */
static uint8_t AppLedStateOn = RESET;


#ifdef USE_B_L072Z_LRWAN1
/*!
 * Timer to handle the application Tx Led to toggle
 */
static TimerEvent_t TxLedTimer;
static void OnTimerLedEvent( void );
#endif
/* !
 *Initialises the Lora Parameters
 */
static  LoRaParam_t LoRaParamInit= {TX_ON_TIMER,
                                    APP_TX_DUTYCYCLE,
                                    CLASS_A,
                                    LORAWAN_ADR_ON,
                                    DR_0,
                                    LORAWAN_PUBLIC_NETWORK };

/* Private functions ---------------------------------------------------------*/
uint8_t COUNT_NUMBER_SW;
extern SensorAxes_t ACC_Value;                  /*!< Acceleration Value */
extern SensorAxes_t GYR_Value;                  /*!< Gyroscope Value */
extern SensorAxes_t MAG_Value;                  /*!< Magnetometer Value */
																		
float Pressure_Value;
float Temperature_Value;
float Humidity_Value;
																		
extern __IO uint8_t SENSOR_DETECTED;
extern void Check_Sensor_Detect(void);
																		
// Check Shock
int8_t Check_Shock = 0;
int8_t Count_Shock = 0;																		
int8_t Loop = 0;
int8_t latch_count = 0;																		
																		
//extern GPIO_TypeDef* LED_PORT[LEDn];
//extern const uint16_t LED_PIN[LEDn];
//                                
//extern GPIO_TypeDef* BUTTON_PORT[BUTTONn];
//extern const uint16_t BUTTON_PIN[BUTTONn]; 
//extern const uint8_t BUTTON_IRQn[BUTTONn];
																		
/**
  * @brief  Main program
  * @param  None
  * @retval None
  */
int main( void )
{
  /* STM32 HAL library initialization*/

  HAL_Init( );
  
  /* Configure the system clock*/
  SystemClock_Config( );
  
  /* Configure the debug mode*/
  DBG_Init( );
  
  /* Configure the hardware*/
  HW_Init( );
  
  /* USER CODE BEGIN 1 */
  /* USER CODE END 1 */
  
  /* Configure the Lora Stack*/
  lora_Init( &LoRaMainCallbacks, &LoRaParamInit);
  
  PRINTF("VERSION: %X\n\r", VERSION);
  
  /* main loop*/
  while( 1 )
  {
    /* run the LoRa class A state machine*/
    lora_fsm( );
    
    DISABLE_IRQ( );
    /* if an interrupt has occurred after DISABLE_IRQ, it is kept pending 
     * and cortex will not enter low power anyway  */
    if ( lora_getDeviceState( ) == DEVICE_STATE_SLEEP )
    {
#ifndef LOW_POWER_DISABLE
      LowPower_Handler( );
			LSM6DS0_Sensor_IO_ITConfig();
#endif
    }
    ENABLE_IRQ();
    
    /* USER CODE BEGIN 2 */
		Check_Sensor_Detect();			// Reading TAP status when wake up Modify 4/1/2018
		if(HAL_GPIO_ReadPin(GPIOB,GPIO_PIN_5) == 1){
			PRINTF("Sensor Status: Active\n\r");
			SENSOR_DETECTED = 1;
			if(latch_count > 7){
				latch_count = 0;
				Count_Shock++;
			}
			latch_count++;
//			Count_Shock++;
		}
    /* USER CODE END 2 */
  }
}

static void LoraTxData( lora_AppData_t *AppData, FunctionalState* IsTxConfirmed)
{
  /* USER CODE BEGIN 3 */
  uint16_t pressure = 0;
  int16_t temperature = 0;
  uint16_t humidity = 0;
  uint8_t batteryLevel;
  sensor_t sensor_data;
	
	////////////////
	int32_t acc_x = 0;
	int32_t acc_y = 0;
	int32_t acc_z = 0;
	int32_t gyr_x = 0;
	int32_t gyr_y = 0;
	int32_t gyr_z = 0;
	int32_t mag_x = 0;
	int32_t mag_y = 0;
	int32_t mag_z = 0;
	
	acc_x = ACC_Value.AXIS_X;
	acc_y = ACC_Value.AXIS_Y;
	acc_z = ACC_Value.AXIS_Z;
	gyr_x = GYR_Value.AXIS_X;
	gyr_y = GYR_Value.AXIS_Y;
	gyr_z = GYR_Value.AXIS_Z;
	mag_x = MAG_Value.AXIS_X;
	mag_y = MAG_Value.AXIS_Y;
	mag_z = MAG_Value.AXIS_Z;
	
	// Reading USER Button
//	uint8_t BUT_State = 0;
//	if(HAL_GPIO_ReadPin(GPIOB, GPIO_PIN_2) == 1) BUT_State = 	1; //USER_BUTTON
  ////////////////
	
#ifdef USE_B_L072Z_LRWAN1
  TimerInit( &TxLedTimer, OnTimerLedEvent );
  
  TimerSetValue(  &TxLedTimer, 200);
  
  LED_On( LED_RED1 ) ; 
  
  TimerStart( &TxLedTimer );  
#endif
#ifndef CAYENNE_LPP
  int32_t latitude, longitude = 0;
  uint16_t altitudeGps = 0;
#endif
  BSP_sensor_Read( &sensor_data );

#ifdef CAYENNE_LPP
  uint8_t cchannel=0;
  temperature = ( int16_t )( sensor_data.temperature * 10 );     /* in °C * 10 */
  pressure    = ( uint16_t )( sensor_data.pressure * 100 / 10 );  /* in hPa / 10 */
  humidity    = ( uint16_t )( sensor_data.humidity * 2 );        /* in %*2     */
  uint32_t i = 0;

	Pressure_Value = sensor_data.pressure;
	Temperature_Value = sensor_data.temperature;
	Humidity_Value = sensor_data.humidity*2;
  
	batteryLevel = HW_GetBatteryLevel( );                     /* 1 (very low) to 254 (fully charged) */
	
  AppData->Port = LPP_APP_PORT;
  
  *IsTxConfirmed =  LORAWAN_CONFIRMED_MSG;
//  AppData->Buff[i++] = cchannel++;
//  AppData->Buff[i++] = LPP_DATATYPE_BAROMETER;
//  AppData->Buff[i++] = ( pressure >> 8 ) & 0xFF;
//  AppData->Buff[i++] = pressure & 0xFF;
//  AppData->Buff[i++] = cchannel++;
//  AppData->Buff[i++] = LPP_DATATYPE_TEMPERATURE; 
//  AppData->Buff[i++] = ( temperature >> 8 ) & 0xFF;
//  AppData->Buff[i++] = temperature & 0xFF;
//  AppData->Buff[i++] = cchannel++;
//  AppData->Buff[i++] = LPP_DATATYPE_HUMIDITY;
//  AppData->Buff[i++] = humidity & 0xFF;
//#if !defined(REGION_US915) && !defined(REGION_US915_HYBRID)
//  AppData->Buff[i++] = cchannel++;
//  AppData->Buff[i++] = LPP_DATATYPE_DIGITAL_INPUT; 
//  AppData->Buff[i++] = COUNT_NUMBER_SW;//batteryLevel*100/254;
//  AppData->Buff[i++] = cchannel++;
//  AppData->Buff[i++] = LPP_DATATYPE_DIGITAL_OUTPUT; 
//  AppData->Buff[i++] = AppLedStateOn;
//#endif

#if 1
  PRINTF("\n\r");
  PRINTF("temperature=%d,%d degC\n\r", temperature/10, temperature-(temperature/10)*10);
  PRINTF("pressure=%d,%d hPa\n\r", pressure/10, pressure - (pressure/10)*10);
  PRINTF("humidity=%d,%d %%\n\r", humidity/2, (humidity*10)/2-(humidity/2)*10);
  PRINTF("batteryLevel=%d %%\n\r", batteryLevel*100/254);
  if ( AppLedStateOn == RESET )
  {
    PRINTF("LED Status: LED OFF\n\r");
  }
  else
  {
    PRINTF("LED Status: LED ON\n\r");
  }
	if(SENSOR_DETECTED == 1){		// Check Tap and clear latch Modify 4/1/2018
		PRINTF("Sensor Status: Active\n\r");
		SENSOR_DETECTED = 0;
		Check_Shock = 1;
	}
	else {
		PRINTF("Sensor Status: Inactive\n\r");
		Check_Shock = 0;
		//Latch = 0;
		
	}
	Loop++;
  PRINTF("\n\r");
#endif
	
//	// Pressure Sensor (/100)
//	AppData->Buff[i++] = 0x01;
//	AppData->Buff[i++] = ( pressure/100 >> 8 ) & 0xFF;
//	AppData->Buff[i++] = pressure/100 & 0xFF;
	// Temperature Sensor
	AppData->Buff[i++] = 0x02;
	AppData->Buff[i++] = ( temperature >> 8 ) & 0xFF;
	AppData->Buff[i++] = temperature & 0xFF;
//	// Humidity Sensor (/2 x10)
//	AppData->Buff[i++] = 0x03;
//	AppData->Buff[i++] = ( (humidity/2)*10 >> 8 ) & 0xFF;
//	AppData->Buff[i++] = (humidity/2)*10 & 0xFF;
//	// Gyrometer (x10)
//	AppData->Buff[i++] = 0x04;
//	AppData->Buff[i++] = ( gyr_x*10 >> 8 ) & 0xFF;
//	AppData->Buff[i++] = gyr_x*10 & 0xFF;
//	AppData->Buff[i++] = ( gyr_y*10 >> 8 ) & 0xFF;
//	AppData->Buff[i++] = gyr_y*10 & 0xFF;
//	AppData->Buff[i++] = ( gyr_z*10 >> 8 ) & 0xFF;
//	AppData->Buff[i++] = gyr_z*10 & 0xFF;
	// Accelerometer (x10)
	AppData->Buff[i++] = 0x05;
	AppData->Buff[i++] = ( acc_x >> 8 ) & 0xFF;
	AppData->Buff[i++] = acc_x & 0xFF;
	AppData->Buff[i++] = ( acc_y >> 8 ) & 0xFF;
	AppData->Buff[i++] = acc_y & 0xFF;
	AppData->Buff[i++] = ( acc_z >> 8 ) & 0xFF;
	AppData->Buff[i++] = acc_z & 0xFF;
//	// Magnetometer (/100)
//	AppData->Buff[i++] = 0x06;
//	AppData->Buff[i++] = ( mag_x/100 >> 8 ) & 0xFF;
//	AppData->Buff[i++] = mag_x/100 & 0xFF;
//	AppData->Buff[i++] = ( mag_y/100 >> 8 ) & 0xFF;
//	AppData->Buff[i++] = mag_y/100 & 0xFF;
//	AppData->Buff[i++] = ( mag_z/100 >> 8 ) & 0xFF;
//	AppData->Buff[i++] = mag_z/100 & 0xFF;
	
//	//Reading LEDs
//	uint8_t LED_State = 0;
//	if(HAL_GPIO_ReadPin(GPIOB, GPIO_PIN_5) == 1) LED_State = LED_State + 1; //LED_1
//	if(HAL_GPIO_ReadPin(GPIOA, GPIO_PIN_5) == 1) LED_State = LED_State + 2; //LED_2
//	if(HAL_GPIO_ReadPin(GPIOB, GPIO_PIN_6) == 1) LED_State = LED_State + 4; //LED_3
//	if(HAL_GPIO_ReadPin(GPIOB, GPIO_PIN_7) == 1) LED_State = LED_State + 8; //LED_4
//	// LEDs
//	AppData->Buff[i++] = 0x07;
//	AppData->Buff[i++] = LED_State;
	
	// D_IN_1
	AppData->Buff[i++] = 0x08;
	AppData->Buff[i++] = Count_Shock;
	Count_Shock = 0;
	// Other I/P
//	// D_IN_2
//	AppData->Buff[i++] = 0x09;
//	AppData->Buff[i++] = SENSOR_DETECTED;
//	// D_IN_3
//	AppData->Buff[i++] = 0x0A;
//	AppData->Buff[i++] = SENSOR_DETECTED;
//	// D_IN_4
//	AppData->Buff[i++] = 0x0B;
//	AppData->Buff[i++] = SENSOR_DETECTED;
//	// D_IN_5
//	AppData->Buff[i++] = 0x0C;
//	AppData->Buff[i++] = SENSOR_DETECTED;
//	// D_OUT_1
//	AppData->Buff[i++] = 0xA0;
//	AppData->Buff[i++] = SENSOR_DETECTED;

//// Pressure Sensor
//	AppData->Buff[i++] = 0x01;
//	AppData->Buff[i++] = ( pressure >> 8 ) & 0xFF;
//	AppData->Buff[i++] = pressure & 0xFF;
	// Temperature Sensor
//	AppData->Buff[i++] = 0x02;
//	AppData->Buff[i++] = 0x00;
//	AppData->Buff[i++] = 0x12;
//	// Humidity Sensor
//	AppData->Buff[i++] = 0x03;
//	AppData->Buff[i++] = ( humidity >> 8 ) & 0xFF;
//	AppData->Buff[i++] = humidity & 0xFF;
//	// Gyrometer
//	AppData->Buff[i++] = 0x04;
//	AppData->Buff[i++] = ( gyr_x >> 8 ) & 0xFF;
//	AppData->Buff[i++] = gyr_x & 0xFF;
//	AppData->Buff[i++] = ( gyr_y >> 8 ) & 0xFF;
//	AppData->Buff[i++] = gyr_y & 0xFF;
//	AppData->Buff[i++] = ( gyr_z >> 8 ) & 0xFF;
//	AppData->Buff[i++] = gyr_z & 0xFF;
//	// Accelerometer
//	AppData->Buff[i++] = 0x05;
//	AppData->Buff[i++] = ( acc_x >> 8 ) & 0xFF;
//	AppData->Buff[i++] = acc_x & 0xFF;
//	AppData->Buff[i++] = ( acc_y >> 8 ) & 0xFF;
//	AppData->Buff[i++] = acc_y & 0xFF;
//	AppData->Buff[i++] = ( acc_z >> 8 ) & 0xFF;
//	AppData->Buff[i++] = acc_z & 0xFF;
//	// Magnetometer
//	AppData->Buff[i++] = 0x06;
//	AppData->Buff[i++] = ( mag_x >> 8 ) & 0xFF;
//	AppData->Buff[i++] = mag_x & 0xFF;
//	AppData->Buff[i++] = ( mag_y >> 8 ) & 0xFF;
//	AppData->Buff[i++] = mag_y & 0xFF;
//	AppData->Buff[i++] = ( mag_z >> 8 ) & 0xFF;
//	AppData->Buff[i++] = mag_z & 0xFF;

//#if 1
//  PRINTF("\n\r");
//  PRINTF("temperature=%d,%d degC\n\r", temperature/10, temperature-(temperature/10)*10);
//  PRINTF("pressure=%d,%d hPa\n\r", pressure/10, pressure - (pressure/10)*10);
//  PRINTF("humidity=%d,%d %%\n\r", humidity/2, (humidity*10)/2-(humidity/2)*10);
//  PRINTF("batteryLevel=%d %%\n\r", batteryLevel*100/254);
//  if ( AppLedStateOn == RESET )
//  {
//    PRINTF("LED Status: LED OFF\n\r");
//  }
//  else
//  {
//    PRINTF("LED Status: LED ON\n\r");
//  }
//	if(SENSOR_DETECTED==1){		// Check Tap and clear latch Modify 4/1/2018
//		PRINTF("Sensor Status: Active\n\r");
//		SENSOR_DETECTED=0;
//		Check_Shock = 1;
//	}
//	else {
//		PRINTF("Sensor Status: Inactive\n\r");
//		Check_Shock = 0;
//	}
//  PRINTF("\n\r");
//#endif
#else
  temperature = ( int16_t )( sensor_data.temperature * 100 );     /* in °C * 100 */
  pressure    = ( uint16_t )( sensor_data.pressure * 100 / 10 );  /* in hPa / 10 */
  humidity    = ( uint16_t )( sensor_data.humidity * 10 );        /* in %*10     */
  latitude = sensor_data.latitude;
  longitude= sensor_data.longitude;
  uint32_t i = 0;

  batteryLevel = HW_GetBatteryLevel( );                     /* 1 (very low) to 254 (fully charged) */

  AppData->Port = LORAWAN_APP_PORT;
  
  *IsTxConfirmed =  LORAWAN_CONFIRMED_MSG;

#if defined( REGION_US915 ) || defined( REGION_US915_HYBRID )
  AppData->Buff[i++] = AppLedStateOn;
  AppData->Buff[i++] = ( pressure >> 8 ) & 0xFF;
  AppData->Buff[i++] = pressure & 0xFF;
  AppData->Buff[i++] = ( temperature >> 8 ) & 0xFF;
  AppData->Buff[i++] = temperature & 0xFF;
  AppData->Buff[i++] = ( humidity >> 8 ) & 0xFF;
  AppData->Buff[i++] = humidity & 0xFF;
  AppData->Buff[i++] = batteryLevel;
  AppData->Buff[i++] = 0;
  AppData->Buff[i++] = 0;
  AppData->Buff[i++] = 0;
#else
  AppData->Buff[i++] = AppLedStateOn;
  AppData->Buff[i++] = ( pressure >> 8 ) & 0xFF;
  AppData->Buff[i++] = pressure & 0xFF;
  AppData->Buff[i++] = ( temperature >> 8 ) & 0xFF;
  AppData->Buff[i++] = temperature & 0xFF;
  AppData->Buff[i++] = ( humidity >> 8 ) & 0xFF;
  AppData->Buff[i++] = humidity & 0xFF;
  AppData->Buff[i++] = batteryLevel;
  AppData->Buff[i++] = ( latitude >> 16 ) & 0xFF;
  AppData->Buff[i++] = ( latitude >> 8 ) & 0xFF;
  AppData->Buff[i++] = latitude & 0xFF;
  AppData->Buff[i++] = ( longitude >> 16 ) & 0xFF;
  AppData->Buff[i++] = ( longitude >> 8 ) & 0xFF;
  AppData->Buff[i++] = longitude & 0xFF;
  AppData->Buff[i++] = ( altitudeGps >> 8 ) & 0xFF;
  AppData->Buff[i++] = altitudeGps & 0xFF;
#endif
#if 0
  PRINTF("\n\r");
  PRINTF("temperature=%d,%d degC\n\r", temperature/100, temperature-(temperature/100)*100);
  PRINTF("pressure=%d hPa\n\r", pressure/10);
  PRINTF("humidity=%d,%d %%\n\r", humidity/10, humidity-(humidity/10)*10);
  PRINTF("batteryLevel=%d %%\n\r", batteryLevel*100/255);
  if ( AppLedStateOn == RESET )
  {
    PRINTF("LED Status: LED OFF\n\r");
  }
  else
  {
    PRINTF("LED Status: LED ON\n\r");
  }
  PRINTF("\n\r");
#endif
#endif
  AppData->BuffSize = i;
  
  /* USER CODE END 3 */
}
    
static void LoraRxData( lora_AppData_t *AppData )
{
  /* USER CODE BEGIN 4 */
  switch (AppData->Port)
  {
  case LORAWAN_APP_PORT:
    if( AppData->BuffSize == 1 )
    {
      AppLedStateOn = AppData->Buff[0] & 0x01;
      if ( AppLedStateOn == RESET )
      {
        PRINTF("LED OFF\n\r");
        LED_Off( LED_BLUE ) ; 
        
      }
      else
      {
        PRINTF("LED ON\n\r");
        LED_On( LED_BLUE ) ; 
      }
      //GpioWrite( &Led3, ( ( AppLedStateOn & 0x01 ) != 0 ) ? 0 : 1 );
    }
    break;
  case LPP_APP_PORT:
  {
    AppLedStateOn= (AppData->Buff[2] == 100) ?  0x01 : 0x00;
      if ( AppLedStateOn == RESET )
      {
        PRINTF("LED OFF\n\r");
        LED_Off( LED_BLUE ) ; 
        
      }
      else
      {
        PRINTF("LED ON\n\r");
        LED_On( LED_BLUE ) ; 
      }
    break;
  }
  default:
    break;
  }
  /* USER CODE END 4 */
}

#ifdef USE_B_L072Z_LRWAN1
static void OnTimerLedEvent( void )
{
  LED_Off( LED_RED1 ) ; 
}
#endif
/************************ (C) COPYRIGHT STMicroelectronics *****END OF FILE****/
