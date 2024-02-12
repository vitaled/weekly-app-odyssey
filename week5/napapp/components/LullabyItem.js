import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Image } from 'react-native';

const styles = StyleSheet.create({
  tile: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  title: {
    fontSize: 16,
  },
});

const LullabyItem = ({ title, path, onPlay, image }) => (
  <TouchableOpacity style={styles.tile} onPress={() => onPlay(title, path,image)}>
    <Image source={image} style={styles.image} />
    <Text style={styles.title}>{title}</Text>
  </TouchableOpacity>
);

export default LullabyItem;
