import { useState, useEffect, useRef } from "react";
import Realm, { BSON } from "realm";

const PlaceSchema = {
  name: "Place",
  properties: {
    _id: "objectId",
    name: "string",
    location: "float[]",
    formattedAddress: "string",
    type: "string",
    phoneNumber: "string?",
    emailAddress: "string?",
    website: "string?",
    description: "string?",
  },
  primaryKey: "_id",
};

const UserSchema = {
  name: "User",
  properties: {
    _id: "objectId",
    username: "string",
    email: "string",
    password: "string",
  },
  primaryKey: "_id",
};

const realmApp = new Realm.App({
  id: "nativemap-doaxl",
  baseUrl: "https://realm.mongodb.com",
});

const useRealm = () => {
  const realmReference = useRef(null);
  const [users, setUsers] = useState([]);
  const [places, setPlaces] = useState([]);
  const [stores, setStores] = useState([]);
  const [cafes, setCafes] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [bakery, setBakery] = useState([]);
  const [gym, setGym] = useState([]);
  const [other, setOther] = useState([]);

  useEffect(() => {
    (async () => {
      const creds = Realm.Credentials.emailPassword("system", "password");
      await realmApp.logIn(creds);
      const config = {
        schema: [PlaceSchema, UserSchema],
        sync: {
          user: realmApp?.currentUser,
          partitionValue: realmApp?.currentUser?.id,
        },
      };

      Realm.open(config)
        .then((realmInstance) => {
          realmReference.current = realmInstance;
          const realm = realmReference.current;
          if (realm) {
            setUsers(realm.objects("User"));
            setPlaces(realm.objects("Place"));
            setStores(realm.objects("Place").filtered("type == 'Store'"));
            setCafes(realm.objects("Place").filtered("type == 'Cafe'"));
            setRestaurants(
              realm.objects("Place").filtered("type == 'Restaurant'")
            );
            setBakery(realm.objects("Place").filtered("type == 'Bakery'"));
            setGym(realm.objects("Place").filtered("type == 'Sports'"));
            setOther(realm.objects("Place").filtered("type == 'Other'"));
          }
        })
        .catch((err) => {
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
    })();
  }, [
    realmReference,
    setUsers,
    setPlaces,
    setStores,
    setCafes,
    setRestaurants,
    setBakery,
    setGym,
    setOther,
  ]);

  const createplace = (
    placeName,
    placeLocation,
    placeFormattedAddress,
    placeType,
    placePhoneNumber,
    placeEmailAddress,
    placeWebsite,
    placeDescription
  ) => {
    const realm = realmReference.current;
    if (realm) {
      realm.write(() => {
        realm.create("Place", {
          _id: new BSON.ObjectID(),
          partition: realmApp.currentUser?.id,
          name: placeName,
          location: placeLocation,
          formattedAddress: placeFormattedAddress,
          type: placeType,
          phoneNumber: placePhoneNumber,
          emailAddress: placeEmailAddress,
          website: placeWebsite,
          description: placeDescription,
        });
      });
    }
  };

  const deleteplace = (place) => {
    // const realm = realmReference.current;
    // if (realm) {
    //   const placesObject = realm.objects("Place");
    //   const selectedPlace = placesObject.filtered("name == '$0'", [
    //     "Test type",
    //   ]);
    //   console.log(selectedPlace);
    //   // realm.write(() => {
    //   //   // const selectedPlace = placesObject.filtered(
    //   //   //   "_id == '6284f590bb5ea6a32577c9b2'"
    //   //   // );
    //   //   // console.log(selectedPlace);
    //   //   // realm.delete(place);
    //   // });
    // }
    // // console.log(place);
  };

  const createUser = (username, email, password) => {
    const realm = realmReference.current;
    if (realm) {
      realm.write(() => {
        realm.create("User", {
          _id: new BSON.ObjectID(),
          partition: realmApp.currentUser?.id,
          username: username,
          email: email,
          password: password,
        });
      });
    }
  };

  const fetchUsers = () => users;
  const fetchPlaces = () => places;
  const fetchStores = () => stores;
  const fetchCafes = () => cafes;
  const fetchRestaurants = () => restaurants;
  const fetchBakery = () => bakery;
  const fetchGym = () => gym;
  const fetchOther = () => other;
  return {
    fetchOther,
    fetchGym,
    fetchBakery,
    fetchRestaurants,
    fetchCafes,
    fetchStores,
    fetchPlaces,
    fetchUsers,
    createplace,
    deleteplace,
    createUser,
  };
};

export default useRealm;
