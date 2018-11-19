# LiraPay
A mobile/desktop wallet application for Lira Cash (cryptocurrency).

# Required Tools
To compile LiraPay the following list of tools and their plugins are required:
- NodeJS
- NPM
- Apache Cordova 
- Android SDK (With Emulator for testing - optional)
- Java SDK 
- Apache Cordova Plugin - cordova-plugin-headercolor
- Apache Cordova Plugin - phonegap-plugin-barcodescanner
- Apache Cordova Plugin - cordova-plugin-file
- Apache Cordova Plugin - cordova-plugin-x-socialsharing
- Apache Cordova Plugin - com.danielsogl.cordova.clipboard
- Apache Cordova Plugin - cordova-plugin-statusbar
- Apache Cordova Plugin - cordova-plugin-whitelist
- Apache Cordova Plugin - cordova-clipboard2
- Apache Cordova Plugin - ionic-plugin-keyboard
- Apache Cordova Plugin - cordova.custom.plugins.exitapp
- Apache Cordova Plugin - cordova-plugin-network-information
- Apache Cordova Plugin - kr.co.joycorp.cordova.exitapp
- Apache Cordova Plugin - cordova-plugin-dialogs
- Apache Cordova Plugin - de.mayflower.cordova.android-scrollbar
- Apache Cordova Plugin - android

# Compile Instruction
This portion of the documentation assumes that the above tools are already installed. For information look up search engines for the complete instruction on how to install the required tools. 

The user must create a cordova project and merge the application source-code into the www folder.

The application can be compiled in both Debug and Release modes. Debug mode is recommended as it requires less than the Release mode to compile.

To compile the application with Debug option: simply open your project directory and type in your terminal: 
cordova build 

When installing the the application, the application may require the user to have their device secuirty set to allow the installation of unsigned applications (debugable APKs), this can be done by browsing the device's settings page and changing the app security settings.

