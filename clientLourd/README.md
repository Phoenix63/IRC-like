# Client Lourd
## Requirements
To run the project you need Qt 5.8 or greater
If you are on linux, you need to install lib32-gstreamer and gst-plugins-good to be able to play sound notifications.

## Build project
### On windows
```
qmake
make
```
Then move the ressources folder to the build folder created at the root of the project. Project can run without this folder but you won't have any sounds or emojis.

### On linux
```
make
```
./chatIRC to run the program once it is compiled
