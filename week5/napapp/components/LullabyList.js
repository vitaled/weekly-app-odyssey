import React from 'react';
import { View } from 'react-native';
import LullabyItem from './LullabyItem';

const LullabyList = ({ lullabies, onPlay }) => (
  <View>
    {lullabies.map((lullaby) => (
      <LullabyItem key={lullaby.title} {...lullaby} onPlay={onPlay} />
    ))}
  </View>
);

export default LullabyList;