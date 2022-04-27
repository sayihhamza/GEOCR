import React, {useState} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  Button,
  TextInput,
  ScrollView,
} from 'react-native';
import useRealm from './functions/useRealm';

const App = () => {
  const {places, createplace} = useRealm();

  return (
    <SafeAreaView
      style={{
        justifyContent: 'center',
        height: '100%',
        width: '100%',
        backgroundColor: 'black',
        alignItems: 'center',
      }}>
      {places ? places.map(place => console.log(place)) : null}
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{textAlign: 'center', color: 'white'}}>NATIVE MAP</Text>
        <Button color="black" title="Create place" onPress={createplace} />
        <TextInput
          style={{height: 40}}
          placeholder="Ktab hena"
          // onChangeText={newText => setText(newText)}
        />
      </View>
    </SafeAreaView>
  );
};

export default App;
