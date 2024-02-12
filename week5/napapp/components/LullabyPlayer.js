import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
} from 'react-native';
import Sound from 'react-native-sound';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Progress from 'react-native-progress';

const {width, height} = Dimensions.get('window');

const play_button_bottom = height / 2 - 150;
const play_button_left = width / 2 - 50;

const styles = StyleSheet.create({
  imageBackground: {
    width: width,
    height: height,
    //   position: 'absolute',
    //   top: 0,
    //   bottom: 0,
    //   left: 0,
    //   right: 0,
    //   justifyContent: 'center',
    //   alignItems: 'center',
  },
  title: {
    fontSize: 24,
    alignContent: 'center',
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
  button: {
    position: 'absolute',
    //flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007BFF',
    padding: 20,
    left: play_button_left,
    bottom: play_button_bottom,
    borderRadius: 50,
    marginBottom: 10,
    width: 100,
    height: 100,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    bottom: 30,
    backgroundColor: '#007BFF',
    padding: 20,
    borderRadius: 50,
  },
});

const LullabyPlayer = ({title, path, onBack, image}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (sound && isPlaying) {
        sound.getCurrentTime(seconds => {
          setProgress(seconds / sound.getDuration());
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [sound, isPlaying]);

  const handlePlayPause = () => {
    console.log('play-pause');
    console.log('sound', sound);
    console.log('isPlaying', isPlaying);
    if (sound) {
      if (isPlaying) {
        setIsPlaying(false);
        sound.pause(() => {
          console.log('paused');
        });
      } else {
        setIsPlaying(true);
        sound.play(success => {
          if (success) {
          } else {
            console.log('playback failed due to audio decoding errors');
          }
        });
      }
    } else {
      const soundInstance = new Sound(path, Sound.MAIN_BUNDLE, error => {
        if (error) {
          console.log('failed to load the sound', error);
        } else {
          setSound(soundInstance);
          setIsPlaying(true);
          soundInstance.play(success => {
            if (success) {
            } else {
              setIsPlaying(false);
              console.log('playback failed due to audio decoding errors');
            }
          });
        }
      });
    }
  };

  const handleBack = () => {
    if (sound) {
      sound.stop(() => {
        sound.release();
        setSound(null);
        setIsPlaying(false);
      });
    }
    onBack();
  };
  return (
    <ImageBackground source={image} style={styles.imageBackground}>
      <Text style={styles.title}>Now Playing: {title}</Text>

      <TouchableOpacity style={styles.button} onPress={handlePlayPause}>
        <Icon name={isPlaying ? 'pause' : 'play'} size={60} color="#FFFFFF" />
      </TouchableOpacity>
      <Progress.Bar
        position="absolute"
        progress={progress}
        width={width - 20}
        left={10}
        height={40}
        color={'#007BFF'}
        unfilledColor={'#FFFFFF'}
        borderWidth={2}
        borderRadius={20}
        bottom={play_button_bottom - 50}
        borderColor={'#007BFF'}
      />
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Icon name="arrow-left" size={40} color="#FFFFFF" />
      </TouchableOpacity>
    </ImageBackground>
  );
};

export default LullabyPlayer;
