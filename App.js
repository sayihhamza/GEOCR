import React, {useState, useEffect, useRef} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  Button,
  TextInput,
  ScrollView,
} from 'react-native';
import {realmApp} from './RealmApp';
import {PlaceSchema} from './PlaceSchema';
import {BSON} from 'realm';

const App = () => {
  const realmReference = useRef(null);
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    // console.log(realmApp.allUsers);
    const creds = Realm.Credentials.emailPassword('system', 'password');
    (async () => {
      await realmApp.logIn(creds);
    })();
    const config = {
      schema: [PlaceSchema],
      sync: {
        user: realmApp.currentUser,
        partitionValue: realmApp.currentUser?.id,
      },
    };

    Realm.open(config)
      .then(realmInstance => {
        realmReference.current = realmInstance;
        console.log(realmInstance);
        const realm = realmReference.current;
        if (realm) {
          setPlaces(realm.objects('Place'));
          // realm.objects('Place').map(place => console.log(place));
          console.log(`There are ${realm.objects('Place').length} places`);
        }
      })
      .catch(err => {
        console.log(`an error occurred opening the realm ${err}`);
      });

    return () => {
      const realm = realmReference.current;
      if (realm) {
        realm.close();
        realmReference.current = null;
        setPlaces([]);
      }
    };
  }, [realmReference]);

  const createplace = () => {
    const realm = realmReference.current;
    if (realm) {
      realm.write(() => {
        realm.create('Place', {
          _id: new BSON.ObjectID(),
          partition: realmApp.currentUser?.id,
          name: 'Realm working',
          location: [32, 52],
          formattedAddress: 'adress realm',
          type: 'type realm',
          phoneNumber: '06495324',
          emailAddress: 'sayih@gmail.com',
          website: 'realm.com',
        });
      });
    }
  };

  const deleteplace = _id => {
    const realm = realmReference.current;
    // if the realm exists, get the place with a particular _id and delete it
    if (realm) {
      const place = realm.objectForPrimaryKey('Place', _id); // search for a realm object with a primary key that is an objectId
      realm.write(() => {
        realm.delete(place);
      });
    }
  };

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
      <ScrollView>
        {places
          ? places.map(place => (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  margin: 5,
                  borderWidth: 2,
                  borderColor: 'grey',
                }}
                key={place._id}>
                <Text>
                  {JSON.stringify(place._id).replace(/[^a-zA-Z0-9 ]/g, '')}
                </Text>
                <Text>{place.name}</Text>
                <Text>{place.formattedAddress}</Text>
                <Text>{place.type}</Text>
                <Text>{`[${place.location[0]},${place.location[1]} ]`}</Text>
                <Text>{place.phoneNumber}</Text>
                <Text>{place.emailAddress}</Text>
                <Text>{place.website}</Text>
              </View>
            ))
          : null}
      </ScrollView>
    </SafeAreaView>
  );
};

export default App;
