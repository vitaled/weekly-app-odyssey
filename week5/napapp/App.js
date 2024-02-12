import React, {useState} from 'react';
import {View} from 'react-native';
import LullabyList from './components/LullabyList';
import LullabyPlayer from './components/LullabyPlayer';

const App = () => {
  const [currentLullaby, setCurrentLullaby] = useState(null);
  const lullabies = [
    {
      title: 'lullaby 1',
      path: 'lullaby1.mp3',
      image: require('./assets/lullaby1.jpg'),
    },
    {
      title: 'lullaby 2',
      path: 'lullaby2.mp3',
      image: require('./assets/lullaby2.jpg'),
    },
    {
      title: 'lullaby 3',
      path: 'lullaby3.mp3',
      image: require('./assets/lullaby3.jpg'),
    },
  ];

  const handlePlay = (title, path, image) => {
    setCurrentLullaby({title, path, image});
  };

  const handleBack = () => {
    setCurrentLullaby(null);
  };

  return (
    <View>
      {currentLullaby ? (
        <LullabyPlayer {...currentLullaby} onBack={handleBack} />
      ) : (
        <LullabyList lullabies={lullabies} onPlay={handlePlay} />
      )}
    </View>
  );
};

export default App;
